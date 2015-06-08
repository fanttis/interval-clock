
var Clock = window.Clock || {};

Clock.main = (function(window, document) {

    var time = document.getElementById( 'time' );
    var tt = document.getElementById( 'tt' );
    var intervals = document.getElementById( 'intervals' );

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

    function pad ( val ) { return val > 9 ? val : "0" + val; }

    /*
     * #Timer
     *  - Start timer
     *  - Log timer into interval mark
     *  - Stop timer
     */

    var Timer = function(el){
        this.el = el;
        this.state = null;
        this.clock = null;
        this.Start();
    }

    Timer.prototype.Start = function(){
        var sec = 0;
        var el = this.el;
        this.state = 1;

        this.clock = setInterval( function(){
            el.getElementsByTagName('time')[0].innerHTML = pad(parseInt(sec/60,10));
            el.getElementsByTagName('time')[1].innerHTML = pad(++sec%60);
        }, 1000);
    }

    Timer.prototype.Stop = function(){
        var el = this.el;
        this.state = 0;
        clearInterval(this.clock);
        el.getElementsByTagName('time')[0].innerHTML = '00';
        el.getElementsByTagName('time')[1].innerHTML = '00';
    }

    Timer.prototype.Interval = function(){
        var log = document.createElement( 'li');
        log.appendChild( document.createTextNode( this.el.innerText ) );
        intervals.appendChild(log);
        this.Stop();
        this.Start();
    }

    var totalTime;
    var intervalTime;

    function startStopTimer(){
        if( typeof totalTime === 'undefined' || totalTime.state === 0 ){
            intervalTime = new Timer(time);
            totalTime = new Timer(tt);
            btn_start_stop.innerHTML = 'Stop';
        } else {
            intervalTime.Stop();
            totalTime.Stop();
            btn_start_stop.innerHTML = 'Start';
            intervals.innerHTML = '';
        }
    }

    function addInterval(){
        if( typeof totalTime !== 'undefined' && totalTime.state === 1 ){
            intervalTime.Interval();
        }
    }

    btn_start_stop.addEventListener( 'click', function(){
        startStopTimer();
    }, false);

    btn_interval.addEventListener( 'click', function(){
        addInterval();
    }, false);

    window.addEventListener( 'keyup', function(e){
        var k = e.keyCode;
        switch(k){
            case 32:
            case 73:
                // Key: Space, I
                e.preventDefault();
                addInterval();
                break;
            case 13:
            case 83:
                // Key: Enter, S
                e.preventDefault();
                startStopTimer();
                break;
            default:
                console.log('Listened keys are: Space (interval), I (i/interval), S (start/stop) and Enter (start/stop)');
        }
    }, false);

}(this, this.document));
