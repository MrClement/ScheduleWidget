var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Created by aclement on 5/15/17.
 */
class Clock {
    constructor(element) {
        this.target = element;
        this.target.innerHTML = this.getTime();
        setInterval(function () {
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
    constructor(now, next, type) {
        this.updatePeriods(now, next, type);
        setInterval(function () {
            this.updatePeriods(now, next, type);
        }.bind(this), 10000);
    }
    updatePeriods(now, next, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let currentPeriodReq = yield fetch('https://kdsapi.org/schedule/period?date=now');
                let periodListReq = yield fetch('https://kdsapi.org/schedule/all_periods');
                let dayTypeReq = yield fetch('https://kdsapi.org/schedule/day_type');
                let currentPeriod = yield currentPeriodReq.json();
                let periodList = yield periodListReq.json();
                let dayType = yield dayTypeReq.json();
                let nextPeriod;
                let date = new Date();
                for (let period of periodList) {
                    let delta = date.getTime() - new Date(period.start_time).getTime();
                    if (delta < 0) {
                        nextPeriod = period;
                        break;
                    }
                }
                if (nextPeriod) {
                    let date = new Date(nextPeriod.start_time);
                    let startTime = date.toLocaleString('en-US', {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric"
                    });
                    date = new Date(nextPeriod.end_time);
                    let endTime = date.toLocaleString('en-US', {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric"
                    });
                    let textToDisplay = `${nextPeriod.title} (${startTime.substring(0, startTime.length - 3)} - ${endTime.substring(0, endTime.length - 3)})`;
                    next.innerHTML = textToDisplay;
                }
                else {
                    next.innerHTML = "-";
                }
                if (dayType.type) {
                    type.innerHTML = dayType.type;
                }
                else {
                    type.innerHTML = "-";
                }
                if (currentPeriod.title) {
                    let date = new Date(currentPeriod.start_time);
                    let startTime = date.toLocaleString('en-US', {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric"
                    });
                    date = new Date(currentPeriod.end_time);
                    let endTime = date.toLocaleString('en-US', {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric"
                    });
                    let textToDisplay = `${currentPeriod.title} (${startTime.substring(0, startTime.length - 3)} - ${endTime.substring(0, endTime.length - 3)})`;
                    now.innerHTML = textToDisplay;
                }
                else if (nextPeriod) {
                    now.innerHTML = "Passing";
                }
                else {
                    now.innerHTML = "-";
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
(function (document) {
    const clock = new Clock(document.querySelector("#dateTimeLabel"));
    const apiLink = new APILink(document.querySelector("#nowLabel"), document.querySelector("#nextLabel"), document.querySelector("#dayLabel"));
}(document));
//# sourceMappingURL=scripts.js.map