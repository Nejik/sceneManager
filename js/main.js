$(function() {
    window.m = new SceneManager('#app', {
        anim:'slideDown'
    })
    // m.on('show', function () {
    //     console.log(arguments)
    // })
    // m.on('shown', function () {
    //     console.log(arguments)
    // })

    $('.showTrans').on('click', function (e) {
        e.preventDefault();
        m.changeScreen('addTransaction');
    })

    $('.showHome').on('click', function (e) {
        e.preventDefault();
        m.changeScreen('home');
    })
});


function SceneManager(el,opts) {
    el = el || opts.el;
    if(!el) return;

    var that = this,
        el = $(el),
        o = $.extend({}, SceneManager.defaults, opts),
        scenes = {
            home: {
                el: $('.scene-home'),
                
            },
            addTransaction: {
                el: $('.scene-addTransaction'),
    
            }
        },
        changing = false;

    scenes[o.active].el.show();
    // Object.keys(scenes).forEach(function (key,index) {
    //     if (key !== o.active) {
    //         scenes[key].el.hide();
    //     }
    // })

    function _getMaxTransitionDuration(el, property) {//method also can get animation duration
        var $el = $(el),
            dur,
            durArr,
            del,
            delArr,
            transitions = [];

        if(!$el.length) return 0;
        if(!property) return 0;

        dur = $el.css(property+'Duration');
        del = $el.css(property+'Delay');

        //make array with durations
        if (!dur || dur == undefined) dur = '0s';
        durArr = dur.split(', ');
        for (var i = 0, l = durArr.length; i < l ;i++) {
            durArr[i] = (durArr[i].indexOf("ms")>-1) ? parseFloat(durArr[i]) : parseFloat(durArr[i])*1000;
        }

        //make array with delays
        if (!del || del == undefined) del = '0s';
        delArr = del.split(', ');
        for (var i = 0, l = delArr.length; i < l ;i++) {
            delArr[i] = (delArr[i].indexOf("ms")>-1) ? parseFloat(delArr[i]) : parseFloat(delArr[i])*1000;
        }

        //make array with duration+delays
        for (var i = 0, l = durArr.length; i < l ;i++) {
            transitions[i] = durArr[i] + delArr[i]
        }

        return Math.max.apply(Math, transitions);
    }

    function changeScreenIn(scene, animation, out) {
        scenes[scene].el.addClass('scene--to').show();
        setTimeout(function() {
            scenes[o.active].el.hide();
            scenes[scene].el.removeClass('scene--to')
            el.removeClass('anim-'+animation);

            o.active = scene;
            changing = false;
            trigger('shown', scene, o.active);//event, next scene, prev scene
        }, _getMaxTransitionDuration(scenes[scene].el ,'animation'));
    }
    function changeScreenOut(scene, animation, out) {
        scenes[scene].el.show();
        scenes[o.active].el.addClass('scene--to');

        setTimeout(function() {
            scenes[o.active].el.hide().removeClass('scene--to');
            el.removeClass('anim-out anim-'+animation)

            o.active = scene;
            changing = false;
            trigger('shown', scene, o.active);//event, next scene, prev scene
        }, _getMaxTransitionDuration(scenes[o.active].el ,'animation'));
    }

    function on(event, fct) {
       that._events = that._events || {};
       that._events[event] = that._events[event] || [];
       that._events[event].push(fct);
       return that; 
    }
    function off(event, fct) {
        that._events = that._events || {};
        if( event in that._events === false) return;
        that._events[event].splice(that._events[event].indexOf(fct), 1);
        return that;
    }
    function trigger(event /* , args... */) {
        that._events = that._events || {};

        if( event in that._events === false  ) return;
        for(var i = 0; i < that._events[event].length; i++){
            that._events[event][i].apply(that, Array.prototype.slice.call(arguments, 1));
        }
        return that;
    }

    return {
        //mini event emitter
        on: on,
        off: off,
        trigger: trigger,
        changeScreen: function (scene, animation, out) {
            if(changing || !scenes[scene] || scene === o.active) return;

            if(typeof animation === 'boolean') {
                out = animation
                animation = o.anim;
            }
            animation = animation || o.anim;

            var that = this;
            this.trigger('show', scene, o.active);//event, next scene, prev scene
            changing = true;

            el.addClass('anim-'+animation);
            if (out) {
                el.addClass('anim-out');
                changeScreenOut(scene, animation)
            } else {
                changeScreenIn(scene, animation)
            }
        }
    }
}

SceneManager.defaults = {
    active: 'home',
    anim: 'fade'
}