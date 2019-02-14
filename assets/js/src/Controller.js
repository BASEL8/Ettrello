import model from "./model";
import view from "./view";
import descriptionHistory from "./template/descriptionHistoryTemp";
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
