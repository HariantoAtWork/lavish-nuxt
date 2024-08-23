// dayjs library with enabled extensions
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
;[
	isBetween,
	isSameOrBefore,
	isSameOrAfter,
	utc,
	timezone,
	duration,
	advancedFormat,
	localizedFormat,
	relativeTime
].forEach(dayjs.extend)

export default dayjs

// EXPOSE dayjs
// window.dayjs = dayjs
