import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @service('admin-creds') creds;
  @tracked adminBtn = true;
}
