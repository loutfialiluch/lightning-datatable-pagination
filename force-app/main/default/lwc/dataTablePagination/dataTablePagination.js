import { LightningElement } from "lwc";

const endpointUrl = "https://jsonplaceholder.typicode.com/todos";

export default class DataTablePagination extends LightningElement {
  columns = [
    { label: "userId", fieldName: "userId" },
    { label: "todoId", fieldName: "id", type: "number" },
    { label: "Title", fieldName: "title", type: "text" },
    { label: "Completed", fieldName: "completed", type: "checkbox" }
  ];
  todos = []; //All todos
  paginatedTodos = []; //displayed Todos in a page
  numberOfPages;
  paginationButtons = [];
  numberOfRowsPerPage = 10;
  currentPage = 1;
  hasPrevious = false;
  hasNext = true;

  renderedCallback() {
    this.setActivatedButton(this.currentPage);
  }
  async connectedCallback() {
    this.todos = await this.fetchData();
    this.paginatedTodos = this.todos.slice(0, this.numberOfRowsPerPage);
    this.numberOfPages = Math.ceil(
      this.todos.length / this.numberOfRowsPerPage
    );
    for (let i = 0; i < this.numberOfPages; i++) {
      this.paginationButtons = [...this.paginationButtons, i + 1];
    }
    this.setActivatedButton(this.currentPage);
  }
  async fetchData() {
    try {
      const response = await fetch(endpointUrl);
      const data = await response.json();
      return data.slice(0, 51);
    } catch (error) {
      console.log(error);
    }
  }

  paginate(event) {
    this.currentPage = event.target.label;
    this.setActivatedButton(event.target.innerText);
    this.setPagination();
  }

  setActivatedButton(buttonNumber) {
    const lightningButtons = this.template.querySelectorAll("lightning-button");
    lightningButtons.forEach((element) => {
      if (element.innerText == buttonNumber) {
        element.variant = "brand";
        return;
      }
      element.variant = "brand-outline";
    });
  }

  setPagination() {
    let startIndex = (this.currentPage - 1) * this.numberOfRowsPerPage;
    let finalIndex = startIndex + this.numberOfRowsPerPage;
    this.paginatedTodos = this.todos.slice(startIndex, finalIndex);
    if (this.currentPage === 1) {
      this.hasPrevious = false;
      this.hasNext = true;
      return;
    }
    if (this.currentPage === this.numberOfPages) {
      this.hasPrevious = true;
      this.hasNext = false;
      return;
    }
    this.hasPrevious = true;
    this.hasNext = true;
  }

  handleNext() {
    this.currentPage++;
    this.setPagination();
    this.setActivatedButton(this.currentPage);
  }
  handlePrevious() {
    this.currentPage--;
    this.setPagination();
    this.setActivatedButton(this.currentPage);
  }
}
