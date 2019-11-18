import { ConfigService } from '../config/config.service';
import { Inject, Injectable } from '@nestjs/common';

const STANDARD_DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss.SSS';

@Injectable()
export class LoggerUtilityService {
  constructor(
    private readonly config: ConfigService,
    @Inject('GetNamespace') private readonly getNamespace,
    @Inject('Moment') private readonly moment,
    @Inject('Os') private readonly os,
  ) {}
  /**
   * Build a log that respects the DSI format
   * {timestamp} {machine name} [{thread name}] {severity} – {Applicative code} –
   * {Correlation id} – {message} – {[Error type] [Status code] Exception message – Stacktrace}
   */
  formatter = ({ level, log }) => {
    const timestamp: string = this.moment().format(STANDARD_DATE_FORMAT);
    const hostname: string = this.os.hostname();
    const machinename = this.os.platform();
    const { pid } = process;

    const ns = this.getNamespace(this.config.get('LOGS_NAMESPACE'));
    const correlationId: string = ns
      ? ns.get(this.config.get('LOGS_CORRELATIONID'))
      : '';
    const formattedCorrelationId: string = correlationId
      ? `${correlationId}`
      : '';
    const featureId: string = ns
      ? ns.get(this.config.get('LOGS_FEATUREID'))
      : '';
    const formattedFeatureId: string = featureId ? `${featureId}` : '';
    const featureName: string = ns
      ? ns.get(this.config.get('LOGS_FEATURENAME'))
      : '';
    const formattedFeatureName: string = featureName ? `${featureName}` : '';
    return `${timestamp};${hostname};${machinename};${pid};${level};${formattedCorrelationId};${formattedFeatureId};${formattedFeatureName};${log}`;
  };
}
