(function () {
  'use strict';

  var model = {
    user: "userName",
    id: 3,
    _lists: [
      {
        id: "list0",
        name: "To-do",
        listItemsId: 2,
        listItems: [
          {
            id: "list0card0",
            text: "To-do 1",
            itemDescription: "new description",
            itemDescriptionHistory: [
              {
                old: "old description",
                date: "2019-01-03 00:00",
                by: "user Name"
              },
              {
                old: "oldest description",
                date: "2019-01-02 00:00",
                by: "user Name"
              }
            ],
            user: "userName",
            date: "2019-01-01 00:00"
          },
          {
            id: "list0card1",
            text: "To-do 2",
            itemDescription: "",
            itemDescriptionHistory: [],
            user: "userName",
            date: "2019-01-01 00:00"
          }
        ]
      },
      {
        id: "list1",
        name: "Doing",
        listItemsId: 2,
        listItems: [
          {
            id: "list1card0",
            text: "Doing 1",
            itemDescription: "",
            itemDescriptionHistory: [],
            user: "userNames",
            date: "2019-01-01 00:00"
          },
          {
            id: "list1card1",
            text: "Doing 2",
            itemDescription: "",
            itemDescriptionHistory: [],
            user: "userName",
            date: "2019-01-01 00:00"
          }
        ]
      },
      {
        id: "list2",
        name: "Done",
        listItemsId: 2,
        listItems: [
          {
            id: "list2card0",
            text: "Done 1",
            itemDescription: "",
            itemDescriptionHistory: [],
            user: "userName",
            date: "2019-01-01 00:00"
          },
          {
            id: "list2card1",
            text: "Done 2",
            itemDescription: "",
            itemDescriptionHistory: [],
            user: "userName",
            date: "2019-01-01 00:00"
          }
        ]
      }
    ],
    getAllData: function() {
      return this._lists;
    },
    addNewList: function() {
      let id = this.id++;
      this._lists.push({
        id: `list${id}`,
        name: `list ${id}`,
        listItemsId: 0,
        listItems: []
      });
    },
    getLastChild: function() {
      return this._lists[this._lists.length - 1];
    },
    removeList: function(id) {
      this._lists.forEach((list, index) => {
        if (list.id === id) {
          this._lists.splice(index, 1);
        }
      });
    },
    rename: function(id, newName) {
      this._lists.forEach(list => {
        if (list.id === id) {
          list.name = newName;
        }
      });
    },
    editCard: function(name, description, cardId, oldDescription) {
      let options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };
      this._lists.forEach(list => {
        list.listItems.forEach(item => {
          if (item.id === cardId) {
            item.text = name;
            item.itemDescription = description;
            if (
              oldDescription.length !== 0 &&
              description.replace(/\s+$/, "") !== oldDescription
            ) {
              item.itemDescriptionHistory.unshift({
                old: oldDescription,
                date: new Date().toLocaleString("sv-SE", options),
                by: this.user
              });
            }
          }
        });
      });
    },
    getCardObj: function(cardId) {
      let obj;
      this._lists.forEach(list => {
        list.listItems.forEach(item => {
          if (item.id === cardId) {
            obj = item;
          }
        });
      });
      return obj;
    },
    addCard: function(id, text, description) {
      let options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };
      this._lists.forEach(list => {
        if (list.id === id) {
          list.listItemsId++;
          list.listItems.push({
            id: `${list.id}card${list.listItemsId}`,
            text: text,
            itemDescription: description,
            user: this.user,
            date: new Date().toLocaleString("sv-SE", options),
            itemDescriptionHistory: []
          });
        }
      });
    },
    moveExistingCard: function(id, obj) {
      this._lists.forEach(list => {
        if (list.id === id) {
          list.listItems.push(obj);
        }
      });
    },
    removeCard: function(listId, cardId) {
      for (let list of this._lists) {
        if (listId === list.id) {
          for (let listItem of list.listItems) {
            if (listItem.id === cardId) {
              list.listItems.splice(list.listItems.indexOf(listItem), 1);
              return;
            }
          }
        }
      }
      //filter function collides with drag n drop somehow
      //  this._lists.forEach(list => {
      //   if (list.id === listId) {
      //     list.listItems.forEach((item, index) => {
      //       if (item.id === cardId) {
      //         list.listItems.splice(index, 1);
      //       }
      //     });
      //   }
      // });
    }
  };

  function descriptionHistory(data, dataIndex, cardId) {
    return `
   <div class="card">
     <div class="card-header" id="heading${dataIndex}-${cardId}">
       <h2 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${dataIndex}-${cardId}" aria-expanded="true" aria-controls="collapseOne">
        Edited By :${data.by} <span>${data.date}</span>
        </button>
      </h2>
    </div>
    <div id="collapse${dataIndex}-${cardId}" class="collapse " aria-labelledby="heading${dataIndex}-${cardId}" data-parent="#accordionExample">
      <div class="card-body">
      ${data.old}
      </div>
    </div>
   </div> 
   `;
  }

  /*by: "userName"
  date: "2019-02-09 12:59"
  old: "" */

  function listItemTemp(data) {
    return `<li class="list-group-item mt-1 ${data.id}" draggable="true">
               <span class="list-item-name">${data.text}</span>
               <div class="d-block mt-2">
                 <span class="badge badge-pill badge-secondary">${
                   data.user
                 }</span>
                 <span class="badge badge-pill badge-success">${
                   data.date
                 }</span>
               </div>
               <div class="dropdown leftDrop dropright">
                 <span data-toggle="dropdown"><i class="fas fa-pen p-1"></i></span>
                 <div class="dropdown-menu todoDropdownHolder border-0">
                   <div class="w-100">
                     <span class="dropdown-item rounded" data-toggle="modal" href="#" data-target="#${
                       data.id
                     }">Edit Labels</span>
                     <span class="dropdown-item rounded removeCard" href="#" data-set="${
                       data.id
                     }">Remove Item</span>
                   </div>
                 </div>
               </div>
             </li>
            <div class="modal fade" id="${data.id}" draggable="false">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h4 class="modal-title">${data.text}</h4>
                    <input type="text" value="${
                      data.text
                    }" class="modal-header-input">
                    <div class="modal-header-tooltip">Click to edit</div>
                  </div>
                  <div class="modal-body">
                    <textarea class="form-control modal-body-input" id="exampleFormControlTextarea1" rows="3" placeHolder="Description"
                    >${data.itemDescription}</textarea>
                    <div class="modal-header-tooltip">Click to edit</div>
                    <!--start-->
                    <div class="accordion" id="accordion${data.id}">
                    ${data.itemDescriptionHistory
                      .map((history, dataIndex) =>
                        descriptionHistory(history, dataIndex, data.id)
                      )
                      .join("")}
                    </div>
                    <!--end-->
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-info editCardDone" data-dismiss="modal">Change</button>
                  </div>
                </div>
              </div>
            </div>`;
  }

  function listTemp(mainData, target) {
    target.innerHTML = "";
    mainData.forEach(data => {
      target.innerHTML += `
  <!--the id of the list-->
  <div class="box col-md-3 border mb-3 p-3 bg-info rounded flex-column d-flex justify-content-between" id="${
    data.id
  }">
      <div class="w-100 m-0">
        <!--Todo List Header + Dropdown Start-->
        <div class="dropdown dropright w-100 p-1">
          <button
            type="button"
            class="btn dropdown-toggle w-100 text-white"
            data-toggle="dropdown"
          >
          <!--the name of the list-->
            ${data.name}
            </button>
            <div class="d-none" style="position:relative;top: -33px;left: 12px;">
            <!--the name of the input element-->
            <input id="nameInput${
              data.id
            }" class="bg-info" style="border:none;color:white;">
            <button class="renameBtn bg-info">Change</button>
            </div>
        
          <div class="dropdown-menu">
            <!--Dropdown List Start-->
            <span class="dropdown-item renameList" href="#">Rename List</span>
            <hr />
            <span class="dropdown-item removeList" href="#">Remove List</span>
            <!--Dropdown List Start-->
          </div>
        </div>
        <!--Todo List Header + Dropdown Start-->
        <ul class="list-group tcards ${data.id}">
        ${data.listItems.map(listItem => listItemTemp(listItem)).join("")}
        </ul>
      </div>
      <!--add card button start -->
      <!--the name of the accordion div-->
      <div class="accordion" id="accordion${data.id}">
        <div class="card mt-4 border-0 bg-info">
          <div
            id="addCardBtn${data.id}"
            class="collapse"
            aria-labelledby="addCardBtnHeading${data.id}"
            data-parent="#accordion${data.id}"
          >
            <div class="card-body p-1">
              <div>
                <ul class="list-group">
                  <li class="list-group-item border-0 p-0 bg-info">
                    <form>
                      <div class="form-group">
                        <label for="textInput${
                          data.id
                        }" class="text-light">Text</label>
                        <input type="text" class="form-control" id="textInput${
                          data.id
                        }" >
                          <div class="invalid-feedback">
                              Can't Add Empty Card.
                          </div>
                      </div>
                      <div class="form-group">
                        <label for="textAreaInput${
                          data.id
                        }" class="text-light">Description</label>
                        <textarea class="form-control" id="textAreaInput${
                          data.id
                        }" rows="3"></textarea>
                      </div>
                      <button type="submit" class="btn btn-link bg-white">
                        Add Card
                      </button>
                    </form>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            class="card-header border-0 p-0 bg-info"
            id="addCardBtnHeading${data.id}"
          >
            <h5 class="mb-0 mt-3 w-100 ">
              <button
                class="btn btn-link collapsed text-white"
                data-toggle="collapse"
                data-target="#addCardBtn${data.id}"
                aria-expanded="false"
                aria-controls="addCardBtn${data.id}"
              >
                add card +
              </button>
            </h5>
          </div>
        </div>
      </div>
      <!-- add card button end-->
    </div>
  
  `;
    });
  }

  function ulListTemp(data) {
    let item = `
      <li>
      <a href="#${data.id}" class=""data-scroll>
      </a>
      <span class=" listSpan">${data.name}</span>
    </li>
      `;
    return item;
  }

  var view = {
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

  let target = document.getElementById("TodoListHolder");
  let addListBtn = document.getElementById("addList");
  addListBtn.addEventListener("click", function() {
    model.addNewList();
    controller.init();
  });
  let controller = {
    init: function() {
      view.init(this.getAllData(), target, this.mainFunctions);
      this.dragDropHandler();
      this.editCardEvent();
    },
    getAllData: function() {
      return model.getAllData();
    },
    dragDropHandler: function() {
      let selectedLi;
      let listId;
      let cardId;

      let listGroupItem = Array.from(
        document.querySelectorAll(".list-group-item")
      );
      listGroupItem.forEach(li => {
        li.addEventListener("dragstart", function() {
          selectedLi = this;
          listId = controller.getListIdFromClass(this);
          cardId = selectedLi.className.match(/list\d+card\d+/)[0];
          setTimeout(function() {
            selectedLi.classList.add("d-none");
          }, 1);
        });
      });

      let lists = Array.from(document.querySelectorAll(".box"));
      lists.forEach(list => {
        list.addEventListener("dragover", function(e) {
          e.preventDefault();
        });

        list.addEventListener("dragend", function() {
          selectedLi.classList.remove("d-none");
        });

        list.addEventListener("drop", function(e) {
          if (controller.getListIdFromId(this) !== listId) {
            model.moveExistingCard(
              controller.getListIdFromId(this),
              model.getCardObj(cardId)
            );
            model.removeCard(listId, cardId);
            controller.init();
          }
        });
      });
    },
    editCardEvent: function() {
      let editCardDoneBtns = Array.from(
        document.querySelectorAll(".editCardDone")
      );
      editCardDoneBtns.forEach(btn => {
        let cardId = controller.getCardId(btn);
        let cardEditUI = document.querySelector(`#${cardId}`);
        let oldValue = "";
        cardEditUI
          .querySelector("textarea")
          .addEventListener("focus", function() {
            oldValue = this.value;
          });
        btn.addEventListener("click", function(e) {
          let inputName = cardEditUI.querySelector("input");
          let inputDescription = cardEditUI.querySelector("textarea");
          model.editCard(
            inputName.value,
            inputDescription.value,
            cardId,
            oldValue
          );
          let listItemName = document.querySelector(`.${cardId} > span`);
          listItemName.textContent = inputName.value;
          cardEditUI.querySelector("#accordion" + cardId).innerHTML = "";
          model
            .getCardObj(cardId)
            .itemDescriptionHistory.forEach((data, index) => {
              cardEditUI.querySelector(
                "#accordion" + cardId
              ).innerHTML += descriptionHistory(data, index, cardId);
            });
          oldValue = "";
        });
      });
    },
    getListIdFromClass: function(element) {
      //used from inside list-structure to see which list the element is a children of
      let regex = /list\d+/; //Sets a regex-definition to be used to the selected list.
      let parent = element; //(element.localName === "ul") ? element : element.parentNode;
      while (!regex.test(parent.className) || parent.localName !== "ul") {
        //if parent does not contain the id we're looking for, enter loop, also making sure regex matches the lists's id and nor card's id
        parent = parent.parentNode; //climb one "step" up the html structure, loop again
      }
      return parent.className.match(regex)[0]; //Uses the above regex to identify the selected lists id.
    },
    getListIdFromId(element) {
      let regex = /list\d+/;
      let parent = element;
      while (!regex.test(parent.id)) {
        parent = parent.parentNode;
      }
      return parent.id.match(regex)[0];
    },
    getCardId: function(element) {
      let regex = /list\d+card\d+/;
      let parent = element;
      while (!regex.test(parent.id)) {
        parent = parent.parentNode;
      }
      return parent.id.match(regex)[0];
    },
    mainFunctions: function(element) {
      let MainElement = document.getElementById(element.id);
      let RemoveListBtn = MainElement.querySelector(".removeList");
      let RenameBtn = MainElement.querySelector(".dropdown .renameList");
      let Input = document.getElementById("nameInput" + element.id);
      let InputHolderDiv = Input.parentElement;
      let CardHolderDiv = document.getElementById(`addCardBtn${element.id}`);
      let TextInput = document.getElementById(`textInput${element.id}`);
      let TextDescription = document.getElementById(`textAreaInput${element.id}`);
      let AddCardBtn = MainElement.querySelector(`button[type="submit"]`);
      let RemoveCardBtn = MainElement.querySelectorAll(".removeCard");

      RemoveListBtn.addEventListener("click", function() {
        model.removeList(this.closest("div[id*='list']").id);
        controller.init();
      });

      RenameBtn.addEventListener("click", function() {
        Input.value = element.name;
        InputHolderDiv.classList.remove("d-none");
        let ChangeBtn = MainElement.querySelector(".renameBtn");
        ChangeBtn.addEventListener("click", function() {
          model.rename(element.id, Input.value);
          controller.init();
        });
      });

      AddCardBtn.addEventListener("click", function(e) {
        e.preventDefault();
        if (TextInput.value.length !== 0) {
          model.addCard(element.id, TextInput.value, TextDescription.value);
          TextInput.value = "";
          TextDescription.value = "";
          CardHolderDiv.classList.remove(`show`);
          controller.init();
        }
      });
      RemoveCardBtn.forEach(Btn => {
        Btn.addEventListener("click", function() {
          model.removeCard(element.id, this.getAttribute("data-set"));
          controller.init();
        });
      });
    }
  };
  controller.init();

}());
