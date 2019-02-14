export default {
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
