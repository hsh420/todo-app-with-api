describe("todo-app-with-api", () => {
  const URL = "http://localhost:3000";
  beforeEach(() => {
    cy.visit(URL);
  });
  it("add todo", () => {
    const newToDo = "ToDo" + Math.floor(Math.random() * 5000);
    cy.get("#add-todo-container input").type(newToDo);
    cy.get("#add-todo-container button").click();
    cy.get("#todos li").last().should("have.text", newToDo);
  });
  it("delete todo", () => {
    const newToDo = "ToDo" + Math.floor(Math.random() * 5000);
    cy.get("#add-todo-container input").type(newToDo);
    cy.get("#add-todo-container button").click();
    cy.get("#todos li").last().should("have.text", newToDo);
    cy.get("#delete-todo-container input").type(newToDo);
    cy.get("#delete-todo-container button").click();
    cy.get("#todos li").contains(newToDo).should("not.exist");
  });
  it("delete done todos", () => {
    const newToDo = "ToDo" + Math.floor(Math.random() * 5000);
    const newToDo2 = "ToDo" + Math.floor(Math.random() * 5000);
    const newToDo3 = "ToDo" + Math.floor(Math.random() * 5000);
    cy.get("#add-todo-container input").type(newToDo);
    cy.get("#add-todo-container button").click();
    cy.get("#add-todo-container input").type(newToDo2);
    cy.get("#add-todo-container button").click();
    cy.get("#add-todo-container input").type(newToDo3);
    cy.get("#add-todo-container button").click();
    cy.get("#todos li input:checkbox").first().check();
    cy.get("#todos li input:checkbox").last().check();
    cy.get("#todos li").first().should("have.class", "linethrough");
    cy.get("#todos li").last().should("have.class", "linethrough");
    cy.get("#delete-all").click();
    cy.get("#todos li").not("have.class", "linethrough");
  });
  it("clear list and display placeholder", () => {
    cy.get("#todos li input:checkbox").check();
    cy.get("#delete-all").click();
    cy.get("#todos li").should("have.text", "Noch keine To-Dos...");
  });
});
