import { connect as syncConnector} from './datasync/Connector';

// Setup all modules
export function setup() {
  // Connect sync
  syncConnector().then(function() {
    // tslint:disable-next-line:no-console
    console.log('Connected');
  }).catch(function(err: any) {
    // tslint:disable-next-line:no-console
    console.log('Failed to initialize sync', err);
  });
}
