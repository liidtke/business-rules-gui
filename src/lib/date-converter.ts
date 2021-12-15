import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import pt from 'dayjs/locale/pt-br';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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