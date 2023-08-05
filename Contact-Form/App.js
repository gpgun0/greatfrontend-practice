import "./styles.css";
import submitForm from "./submitForm";

export default function App() {
  return (
    <form
      class="form-example"
      onSubmit={submitForm}
      action="https://www.greatfrontend.com/api/questions/contact-form"
      method="POST"
    >
      <div class="form-example">
        <label for="name">Enter your name: </label>
        <input name="name" type="text" />
      </div>

      <div class="form-example">
        <label for="email">Enter your email: </label>
        <input name="email" type="email" />
      </div>

      <div class="form-example">
        <label for="message">Enter your message: </label>
        <textarea name="message" type="text" />
      </div>

      <div class="form-example">
        <input type="submit" value="Send" />
      </div>
    </form>
  );
}
