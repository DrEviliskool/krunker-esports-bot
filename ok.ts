import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import ms from 'ms';

const service = new HumanizeDuration(new HumanizeDurationLanguage())


  console.log(service.humanize(ms('1y')));