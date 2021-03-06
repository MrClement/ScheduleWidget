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
                let date: Date = new Date(nextPeriod.start_time);
                let startTime: string = date.toLocaleString('en-US', {
                    hour12: true,
                    hour: "numeric", 
                    minute: "numeric"
                });
                date = new Date(nextPeriod.end_time);
                let endTime: string = date.toLocaleString('en-US', {
                    hour12: true,
                    hour: "numeric", 
                    minute: "numeric"
                });
                let textToDisplay: string = `${nextPeriod.title} (${startTime.substring(0, startTime.length-3)} - ${endTime.substring(0, endTime.length-3)})`;
                next.innerHTML = textToDisplay;
            } else {
                next.innerHTML = "-";
            }
            if(dayType.type){
                type.innerHTML = dayType.type;
            } else {
                type.innerHTML = "-";
            }
            if(currentPeriod.title) {
                let date: Date = new Date(currentPeriod.start_time);
                let startTime: string = date.toLocaleString('en-US', {
                    hour12: true,
                    hour: "numeric", 
                    minute: "numeric"
                });
                date = new Date(currentPeriod.end_time);
                let endTime: string = date.toLocaleString('en-US', {
                    hour12: true,
                    hour: "numeric", 
                    minute: "numeric"
                });
                let textToDisplay: string = `${currentPeriod.title} (${startTime.substring(0, startTime.length-3)} - ${endTime.substring(0, endTime.length-3)})`;
                now.innerHTML = textToDisplay;
            } else if(nextPeriod) {
                now.innerHTML = "Passing";
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
