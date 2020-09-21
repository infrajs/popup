import { Path } from '/vendor/infrajs/path/Path.js'
import { Event } from '/vendor/infrajs/event/Event.js'
import { CDN } from '/vendor/akiyatkin/load/CDN.js'
import { Code } from '/vendor/infrajs/memcode/Code.js'
import { Load } from '/vendor/akiyatkin/load/Load.js'
import { createPromise } from '/vendor/akiyatkin/load/Fire.js'
let Popup = {};
Popup.stack = [];//все окна которые находятся в обработке. 
Popup.heap = [];//все когда либо показанные окна
Popup.st = false;//активное окно
Popup.counter = 0;

Popup.memorize = async code => {
	//if (!Popup.st) return;
	await CDN.fire('load','bootstrap')
	await Popup.init()
	Code.save('popup', code);
	Popup.div.on('hidden.bs.modal', function () {
		Code.remove('popup', code);
	});
	//Event.onext('Layer.onhide',function(){
	//Code.remove('popup',code);
	//},'',popup.st.obj);
}

Popup.stackAdd = function (obj) {
	var st = false;
	for (var i = 0, l = Popup.stack.length; i < l; i++) {
		if (Popup.stack[i].obj === obj) {
			st = Popup.stack.splice(i, 1)[0];
			break;
		}
	}
	if (!st) {
		for (var i = 0, l = Popup.heap.length; i < l; i++) {
			if (Popup.heap[i].obj === obj) {
				st = Popup.heap.splice(i, 1)[0];
				break;
			}
		}
	}
	if (!st) st = { counter: ++Popup.counter, obj: obj };
	Popup.stack.push(st);
	return st;
}
Popup.stackGet = function (obj) {
	var i, st, l;
	for (i = 0, l = Popup.stack.length; i < l; i++) {
		st = Popup.stack[i];
		if (st.obj === obj) return st;
	}
	for (i = 0, l = Popup.heap.length; i < l; i++) {
		st = Popup.heap[i];
		if (st.obj === obj) return st;
	}
}
Popup.stackClear = function () {
	var st;
	while (st = Popup.stack.pop()) {
		Popup.heap.push(st);
	}
},
Popup.stackLast = function () {
	var st = Popup.stack[Popup.stack.length - 1];
	return st;
}
Popup.stackDel = function (obj) {
	var st = false;
	for (var i = 0, l = Popup.stack.length; i < l; i++) {
		if (Popup.stack[i].obj === obj) {
			st = Popup.stack.splice(i, 1)[0];
			Popup.heap.push(st);
			break;
		}
	}
	return st;
}


Popup.activate = async st => {
	if (Popup.st == st) {
		//Controller.autofocus(st.layer);
		return;
	}
	let Controller = (await import('/vendor/infrajs/controller/src/Controller.js')).Controller
	var check = [];
	if (Popup.st) {
		Popup.justhide(Popup.st);
		check.push(Popup.st.layer);
	}
	await Popup.justshow(st);
	check.push(st.layer)
	Popup.st = st;
	//await Controller.check();
	await Controller.checkAdd(st.layer);
	//await Controller.check(check);
	await DOM.puff('check')
	//await Controller.check();
	
}
Popup.showbig = async (obj) => {
	if (!obj) return;
	var st = Popup.stackAdd(obj);
	st.layer = obj;
	st.big = true;
	await Popup.activate(st);
}
Popup.show = async (obj) => {
	if (!obj) return;
	var st = Popup.stackAdd(obj);
	st.layer = obj;
	await Popup.activate(st);
}
Popup.text = async (obj) => {
	if (!obj) return;
	var st = Popup.stackAdd(obj);
	if (!st.layer) st.layer = { tpl: [obj] }
	await Popup.activate(st);
}
Popup.open = function (obj) {//depricated??? Слой показывается с отступами от краёв, с кнопокй закрыть.
	if (!obj) return;
	var st = Popup.getStLayer(obj, obj, '-popup/open.tpl');
	Popup.activate(st);
}
Popup.alert = async (obj) => {
	if (!obj) return;
	var st = Popup.getStLayer(obj, { tpl: [obj] }, '-popup/alert.tpl');
	await Popup.activate(st);
}
Popup.success = function (obj) {
	if (!obj) return;
	var st = Popup.getStLayer(obj, { tpl: [obj] }, '-popup/success.tpl');
	Popup.activate(st);
}
Popup.progress = function (val) {
	if (!Popup.progressobj) Popup.progressobj = {};
	var st = Popup.stackAdd(Popup.progressobj);
	if (!st.layer) {
		st.strict = true;
		st.layer = {
			tpl: '-popup/progress.tpl',
			tplroot: 'root'
		}
		Event.handler('Layer.onshow', function (layer) {
			var bar = $('#' + layer.div).find('.progress-bar');
			var set = function () {
				if (!layer.showed) return;
				var val = Popup.progressobj.val;
				if (val < 99) Popup.progressobj.val++;
				if (val >= 100) {
					clearInterval(Popup.progressobj.timer);
					Popup.hide();
				}
				bar.css('width', val + '%').attr('aria-valuenow', val);
			}
			clearInterval(Popup.progressobj.timer);
			Popup.progressobj.timer = setInterval(function () {
				set();
			}, 300);
			set();
		}, '', st.layer);
	}
	Popup.activate(st);
	if (!val) val = 1;
	Popup.progressobj.val = val;
}
Popup.error = function (obj) {
	if (!obj) return;
	var st = Popup.getStLayer(obj, { tpl: [obj] }, '-popup/error.tpl');
	Popup.activate(st);
}
Popup.confirm = function (obj, callback, title) {
	if (!obj) return;
	var st = Popup.getStLayer(obj, { autofocus: true, tpl: [obj] }, '-popup/confirm.tpl', title);
	st.layer.conf_ok = callback;
	Popup.activate(st);
}
Popup.getStLayer = function (obj, objtpl, tpl, title) {
	var st = Popup.stackAdd(obj);
	if (!st.layer) {
		var divid = 'stdivpopup' + st.counter;
		st.layer = {
			tpl: tpl,
			tplroot: 'root',
			conf_divid: divid,
			conf_title: title || "Внимание",
			divs: {}
		}
		st.layer.divs[divid] = objtpl;
	}
	return st;
};

Popup.hide = async function (obj) {
	if (!obj && Popup.st) obj = Popup.st.obj;
	if (!obj) return;
	var st = Popup.stackDel(obj);
	var next = Popup.stackLast();

	//anti activate
	var check = [];
	Popup.st = next;
	Popup.justhide(st);
	check.push(st.layer);
	if (next) {
		await Popup.justshow(next);
		check.push(next.layer);
	}
	//let Controller = (await import('/vendor/infrajs/controller/src/Controller.js')).Controller
	DOM.puff('check')
	//await Controller.check(check);
}
Popup.toggle = function (obj) {//Если окно
	var st = Popup.stackGet(obj);
	if (!st || Popup.st !== st) return Popup.open(obj);
	else return Popup.hide(obj);
}

Popup.justhide = function (st) {

	st.layer.popupis = false;
	if (!Popup.st) Popup.div.modal('hide');
}
Popup.justshow = async st => {
	await Popup.init();
	if (st.big) {
		document.getElementsByClassName('modal-dialog')[0].classList.add('modal-lg')
	} else {
		document.getElementsByClassName('modal-dialog')[0].classList.remove('modal-lg')
	}
	var cont = Popup.div.find('#popup_content');
	var divid = 'popupinst' + st.counter;
	var place = cont.find('#' + divid);
	st.layer.popupis = true;
	if (!place.length) {
		cont.append('<div id="' + divid + '"></div>');
		//Controller.checkAdd(st.layer);
		st.layer.div = divid;
	}

	var opt = { show: true, keyboard: false };
	if (st.strict) {
		opt.backdrop = 'static';
	} else {
		opt.backdrop = true;
	}

	//Popup.refreshBackdrop(opt);	
	await CDN.fire('load','bootstrap')
	Popup.div.modal(opt);//Нужно запускать постоянно так как она может быть скрыто средствами bootstrap modal
}
Popup.render = async () => {
	//Подтягиваем фон согласно размера окна
	//Popup.div.data('bs.modal').adjustBackdrop();
	if (!Popup.st) return
	await CDN.fire('load','bootstrap')
	if (Popup.div.data && Popup.div.data('bs.modal') && Popup.div.data('bs.modal').adjustDialog) Popup.div.data('bs.modal').adjustDialog();
}
Popup.refreshBackdrop = function (opt) {
	var mod = Popup.div.data('bs.modal');
	if (mod) {
		if (mod.options.backdrop != opt.backdrop) {
			mod.options.backdrop = opt.backdrop;
			if (Popup.st) {
				mod.$element.off('click.dismiss.bs.modal');
				mod.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
					if (this.ignoreBackdropClick) {
						this.ignoreBackdropClick = false;
						return;
					}
					if (e.target !== e.currentTarget) return
					this.options.backdrop == 'static'
						? this.$element[0].focus()
						: this.hide()
				}, mod));
			}
		}
	}
}

Popup.getLayer = function () {
	if (!Popup.st) return;
	return Popup.st.layer;
},
Popup.div = false;//Здесь хранится jquery объект окна

Popup.init = async () => {
	let promise = createPromise()
	Popup.init = function () { return promise }
	
	let text = await Load.fire('text', '-popup/popup.tpl')

	Popup.div = $(text);
	$(document.body).append(Popup.div);
	
	

	Popup.div.on('shown.bs.modal', function () {
		if (!Popup.st) return;	
		//modal окно сбрасывает фокус выставляя его на блок всего окна... бред какой-то... приходится использовать логику расширения autofocus чтобы и расширение работало и фокус если и ставился то на инпут с атрибутом autofocus
		//Controller.autofocus(Popup.st.layer);
	});
	Popup.div.on('hide.bs.modal', function () {
		Popup.div.removeClass('fade');//скрытие обычное иначе глюки с затемнением
		
	});
	Popup.div.on('hidden.bs.modal', async () => {
		Popup.div.addClass('fade');
		if (Popup.st) {//Есть активное окно значит close не был вызван
			await Popup.hide();
		} else {

		}
	});
	$('body').on('keydown', async (e) => {
		if (e.which == 27) {
			if (!Popup.st) return;
			if (Popup.st.strict) return;
			await Popup.hide();
			e.preventDefault();
		}
	});
	promise.resolve()
	return promise
}




Popup.hideAll = async () => { //Закрываем все окна в стеке
	if (!Popup.st) return;
	var st = Popup.st;
	Popup.st = false;
	Popup.stackClear();
	Popup.justhide(st);
	//let Controller = (await import('/vendor/infrajs/controller/src/Controller.js')).Controller
	//await Controller.check(st.layer);
	await DOM.puff('check')
}
Popup.isShow = function () {
	return !!Popup.st;
}
Popup.closeAll = function () {//depricated
	return Popup.hideAll();
}
Popup.center = function () {//depricated
	Popup.render();
}

Popup.close = function () {//depricated
	return Popup.hide.apply(this, arguments);
}

window.Popup = Popup;
window.popup = window.Popup;
export { Popup }
export default Popup