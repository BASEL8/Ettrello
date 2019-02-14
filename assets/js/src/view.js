import { listTemp } from "./template/listTemp";
import { ulListTemp } from "./template/ulListTemp";
export default {
  init: function(data, target, mainFunctions) {
    document.getElementById("listNav").innerHTML = this.renderNavList(data);
    listTemp(data, target);
    data.forEach(element => {
      mainFunctions(element);
    });
    this.intersectionObserver(target.children);
  },
  renderNavList: function(data) {
    let ul = "";
    data.forEach(element => {
      ul += ulListTemp(element);
    });
    return ul;
  },
  intersectionObserver: function(t) {
    [...t].forEach(li => {
      $(`li a[href="#${li.id}"]`).height($(li).height() / 15);
    });
  }
};
