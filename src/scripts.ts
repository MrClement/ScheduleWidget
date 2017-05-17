/**
 * Created by aclement on 5/15/17.
 */


class Clock {
    target: Element;

    constructor(element: Element) {
        this.target = element;
        this.target.innerHTML = this.getTime();
        setInterval(function() {
            this.target.innerHTML = this.getTime();
        }.bind(this), 1000);
    }

    getTime() {
        const date = new Date();
        return date.toLocaleString('en-US', {
            hour12: true,
            month: "short",
            day: "numeric", 
            hour: "numeric", 
            minute: "numeric"
        });
    }
}

class APILink {


    constructor(now: Element, next: Element, type: Element) {
        this.updatePeriods(now, next, type);
        setInterval(function() {
            this.updatePeriods(now, next, type);
        }.bind(this), 10000);
    }


    async updatePeriods(now: Element, next: Element, type:Element) {
        try {
            let currentPeriodReq = await fetch('https://kdsapi.org/schedule/period?date=now');
            let periodListReq = await fetch('https://kdsapi.org/schedule/all_periods');
            let dayTypeReq = await fetch('https://kdsapi.org/schedule/day_type')
            let currentPeriod = await currentPeriodReq.json();
            let periodList = await periodListReq.json();
            let dayType = await dayTypeReq.json();
            let nextPeriod;
            let date = new Date();
            for(let period of periodList) {
                let delta = date.getTime() - new Date(period.start_time).getTime();
                if(delta < 0) {
                    nextPeriod = period;
                    break;
                }
            }
            if(nextPeriod) {
                next.innerHTML = nextPeriod.title;
            } else {
                next.innerHTML = "-";
            }
            if(dayType.type){
                type.innerHTML = dayType.type;
            } else {
                type.innerHTML = "-";
            }
            if(currentPeriod.title) {
                now.innerHTML = currentPeriod.title;
            } else if(nextPeriod) {
                now.innerHTML = "Break";
            } else {
                now.innerHTML = "-"
            }
            
        } catch(err) {
            console.log(err);
        
        }
    

    }

}

(function(document) {
   const clock = new Clock(document.querySelector("#dateTimeLabel"));
   const apiLink = new APILink(document.querySelector("#nowLabel"), document.querySelector("#nextLabel"), document.querySelector("#dayLabel"))
} (document));
