
var Clock = window.Clock || {};

Clock.main = (function(window, document) {

    var time = document.getElementById( 'time' );
    var rt = document.getElementById( 'rt' );
    var st = document.getElementById( 'st' );
    var sprint_log = document.getElementById( 'sprint-log' );

    var btn_start_stop = document.getElementById( 'timer-startstop' );
    var btn_interval = document.getElementById( 'timer-interval' );

    /*
     * #Helper functions
     */
    function hasClass(el, cls){
        return el.className.match(cls) !== null;
    }

    function addClass(el, cls){
        el.className += ' '+cls;
    }

    function removeClass(el, cls){
        el.className = el.className.replace(cls,' ');
    }

    function pad(val){
        return val > 9 ? val : "0" + val;
    }

    /*
     * #Timer
     *  - Start timer
     *  - Log timer into interval mark
     *  - Stop timer
     */

    var Timer = function(el){
        this.el = el;
        this.order = 1;
        this.state = null;
        this.clock = null;
        this.Start();
    };

    Timer.prototype.Start = function(){
        var sec = 0;
        var el = this.el;
        el.getElementsByTagName('span')[0].innerHTML = '00';
        el.getElementsByTagName('span')[1].innerHTML = '00';
        this.state = 1;

        this.clock = setInterval( function(){
            el.getElementsByTagName('span')[0].innerHTML = pad(parseInt(sec/60,10));
            el.getElementsByTagName('span')[1].innerHTML = pad(++sec%60);
        }, 1000);
    };

    Timer.prototype.Stop = function(){
        this.state = 0;
        clearInterval(this.clock);
    };

    Timer.prototype.Interval = function(){
        var log_item = document.createElement( 'li');
        var el_time = document.createElement( 'time' );
        var log = this.el.nextSibling.nextSibling;
        el_time.dataset.order = this.order;
        this.order += 1;
        log_item.appendChild( el_time ).appendChild( document.createTextNode( this.el.textContent ) );
        log.insertBefore(log_item, log.firstChild);

        if( this.state === 1 ){
            this.Stop();
            this.Start();
        } else {
            this.Stop();
        }

    };

    var runTime;
    var intervalTime;
    var sessionTime;

    function saveAndClearSet(){
        var prev_set = sprint_log.cloneNode(true);
        prev_set.id = '';
        prev_set.className = 'log log-history';
        sprint_log.parentNode.insertBefore( prev_set, sprint_log.nextSibling );

        btn_start_stop.innerHTML = 'Start';
        sprint_log.innerHTML = '';
        removeClass( btn_start_stop.parentNode, 'active' );
    }

    function startStopTimer(){
        if( typeof sessionTime === 'undefined' ){
            sessionTime = new Timer(st);
        }

        if( typeof runTime === 'undefined' || runTime.state === 0 ){

            if( typeof runTime === 'undefined' ){
                intervalTime = new Timer(time);
                runTime = new Timer(rt);
            } else {
                intervalTime.order = 1;
                intervalTime.Start();
                runTime.Start();
            }

            btn_start_stop.innerHTML = 'Stop';
            addClass( btn_start_stop.parentNode, 'active' );
        } else {
            intervalTime.state = 0;
            intervalTime.Interval();

            runTime.state = 0;
            runTime.Interval();

            saveAndClearSet();
        }
    }

    function addInterval(){
        if( typeof runTime !== 'undefined' && runTime.state === 1 ){
            intervalTime.Interval();
        }
    }

    btn_start_stop.addEventListener( 'click', function(){
        startStopTimer();
    }, false);

    btn_interval.addEventListener( 'click', function(){
        addInterval();
    }, false);

    window.addEventListener( 'keyup', function(event){
        switch(event.keyCode){
            case 32:
            case 73:
                // Key: Space, I
                event.preventDefault();
                addInterval();
                break;
            case 13:
            case 83:
                // Key: Enter, S
                if( event.target === btn_start_stop ) return false;
                event.preventDefault();
                startStopTimer();
                break;
            default:
                console.log('Listened keys are: Space (interval), I (i/interval), S (start/stop) and Enter (start/stop)');
        }
    }, false);

}(this, this.document));
