// import moment from 'moment';
import dayjs from './dayjs-extend'

import __ from './trans'

const HOUR = 3600
const MINUTE = 60
const timeHelper = {
	getCurrentDateTimeUTC() {
		return dayjs.utc().format()
	},

	getCurrentTimestamp: () => Math.round(new Date().getTime() / 1000),

	getTimestampByDateTime: dateTime => dayjs(dateTime).unix(),

	getShortDate: dateTime => dayjs(dateTime).format('DD/MM/YYYY'),

	getClockFormat(dateTime) {
		const { isOnTheHour } = timeHelper
		if (window.squaresData.event.use_twelve_hour_format) {
			return isOnTheHour(dateTime) ? 'ha' : 'h:mma'
		}

		return 'HH:mm'
	},

	isDuringDateTimes(begin, end) {
		// https://day.js.org/docs/en/plugin/is-between#docsNav
		return dayjs().isBetween(begin, end, null, '[)')
	},

	isInFuture(begin) {
		// https://day.js.org/docs/en/query/is-before
		return dayjs().isBefore(begin)
	},

	isBefore(date) {
		return dayjs(date).isBefore(dayjs().add(-1, 'days'))
	},

	isSame(date, type) {
		return dayjs().isSame(date, type)
	},

	isOnTheHour(dateTime) {
		return !dayjs(dateTime).minute() > 0
	},

	formatDateTime(dateTime, format = 'hh:mm:ss', location = dayjs.tz.guess()) {
		return dayjs(dateTime).tz(location).format(format)
	},

	timezoneAbbreviation(location = dayjs.tz.guess()) {
		const unabbreviated = dayjs().tz(location).format('zzz')
		if (unabbreviated.includes('GMT')) return ''

		const abbreviated = unabbreviated.match(/\b(\w)/g).join('')

		if (abbreviated === 'CEST' && unabbreviated.includes('Standard'))
			return 'CET'

		return abbreviated
	},

	formatByDay(date, format = 'ddd D MMM') {
		const { isSame, formatDateTime } = timeHelper
		if (isSame(date, 'day')) return __('Today')
		else if (isSame(dayjs(date).add(-1, 'days'), 'day')) return __('Tomorrow')
		else if (isSame(dayjs(date).add(1, 'days'), 'day')) return __('Yesterday')
		return formatDateTime(date, format)
	},

	formatByTime(date, format = 'DD/MM') {
		const { isSame, formatDateTime } = timeHelper
		if (isSame(date, 'day')) return formatDateTime(date, 'HH:mm')
		else if (isSame(dayjs(date).add(-1, 'days'), 'day')) return __('Tomorrow')
		else if (isSame(dayjs(date).add(1, 'days'), 'day')) return __('Yesterday')
		return formatDateTime(date, format)
	},

	subtractFromTime(time, subtractTime, unit) {
		const dt = dayjs(time)
		return dt.subtract(subtractTime, unit)
	},

	getHoursTillTime: timestamp => Math.floor(timestamp / HOUR),

	getMinutesTillTime: timestamp => Math.floor(timestamp / MINUTE),

	getSecondsTillTime: Math.floor,

	getMinutesInHourTillTime: timestamp =>
		Math.floor((timestamp % HOUR) / MINUTE),

	getSecondsOfMinuteTillTime: timestamp => (timestamp % HOUR) % MINUTE,

	getSecondsTill: time => time - (new Date().getTime() % time),

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
	dateFormatted: (date, locale = navigator.language, options = {}) =>
		new Intl.DateTimeFormat(locale, options).format(new Date(date)),

	timeUntilNextEvent(futureDate, date = dayjs.utc().format()) {
		// Display time format within 24-hours
		let future = dayjs(futureDate)
		const duration = future.diff(date)
		let months = '0',
			days = '0'
		let hours = '00',
			minutes = '00',
			seconds = '00'

		let time = '00:00:00'
		if (duration > 0) {
			time = dayjs.duration(duration).format('HH:mm:ss')

			months = future.diff(date, 'months')
			future = future.subtract(months, 'months')
			days = future.diff(date, 'days')
			future = future.subtract(days, 'days')
			hours = future.diff(date, 'hours')
			future = future.subtract(hours, 'hours')
			minutes = future.diff(date, 'minutes')
			future = future.subtract(minutes, 'minutes')
			seconds = future.diff(date, 'seconds')
		}

		return {
			full: time,
			months,
			days,
			hours,
			minutes,
			seconds
		}
	}
}

export default timeHelper
