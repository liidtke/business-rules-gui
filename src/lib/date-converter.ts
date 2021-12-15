import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import pt from 'dayjs/locale/pt-br.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

export class DateConverter {

    private format: string = 'L LTS';
    locale: 'pt';
    tzone:'America/Sao_Paulo'
    
    constructor() {
        dayjs.extend(LocalizedFormat);
        dayjs.extend(customParseFormat);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.tz.setDefault(this.tzone);
        dayjs.locale(pt);
    }

    convert(value, customFormat = null){
        let date = dayjs.utc(value).local();
        return date.format(customFormat || this.format);
    }
}

const dateConverter = new DateConverter();

export default dateConverter;