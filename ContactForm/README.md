Building forms is a common task in Front End. In this exercise, we will build a basic "Contact Us" form, commonly seen on marketing websites for visitors to ask questions or provide feedback.

## Requirements
- The form should contain the following elements:
    - Name field
    - Email field
    - Message field. Since the message can be long, using a <textarea> will be more suitable.
- Submit button
    - Contains the text "Send".
    - Clicking on the submit button submits the form.
- The form and submission should be implemented mostly in HTML.
- There is no need to do any client-side validation on the fields. Validation will be done on the server side.

## Submission API
Upon submission, `POST` the form data to `https://www.greatfrontend.com/api/questions/contact-form` with the following fields in the request body: `name`, `email`, `message`.

If all the form fields are correctly filled up, you will see an alert containing a success message. Congratulations!

## Notes
You do not really need JavaScript for this question, the focus is on HTML form validation and submission.

## Goals

### `<form>`의 `action`, `method` 속성을 알 수 있다.
&nbsp;form 제출할 때 사용할 HTTP 메서드를 지정합니다.

- post: form 데이터를 request body로 전송합니다.

**ex.**

form data
```html
<form
    onSubmit={submitForm}
    action="https://www.example.com/api/questions/contact-form"
    method="POST"
>
    <input name="name" type="text" />
    <input name="email" type="email" />
    <textarea name="message" type="text" />
</form>
```

request body
```json
{
    "name": "kim",
    "email": "kim@gmail.com",
    "message": "hi"
}
```

- get(default): form 데이터가 action URL에 `?`와 함께 추가됩니다. form이 side effect가 없을 때 사용하세요.

- dialog: form이 <dialog>안에 있을 때, data를 전송하거나 form을 비우는 것 없이 dialog를 닫아줍니다.

&nbsp;이들은 `<button>`, `<input type="submit">`, `<input type="image">` element의 formmethod 속성에 의해 오버라이딩될 수 있습니다. formmethod를 지정한 경우, 버튼이 속한 form이 가진 method 특성보다 우선합니다.

**ex.**
```html
<form action="/submit_form" method="post" id="myForm">
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" required><br>
  <label for="password">Password:</label>
  <input type="password" id="password" name="password" required><br>
  <button type="submit" formmethod="get">Submit</button> <!-- get 요청  -->
</form>
```

### `<label>`의 `for` 속성을 알 수 있다.
&nbsp;`<label>` 을 `<input>` 요소와 연관시키려면, `<input>`에 `id` 속성을 넣어야합니다. 그런 다음 `<label>` 에 `id`와 같은 값의 `for` 속성을 넣어야합니다.

이를 통해 얻는 이점들입니다.

- 스크린 리더는 사용자가 input을 포커스 시킬 때 관련 label을 읽어낼 것입니다. assistive technology를 사용하는 사용자가 입력해야 하는 데이터가 무엇인지 쉽게 파악할 수 있습니다.
- label을 클릭하여 input을 포커스하거나 활성화시킬 수 있습니다. 이는 누를 수 있는 영역인 hit area를 늘려줍니다. 특히 터치 스크린 사용자에게 편의를 제공합니다.

### `<input>`의 `type`, `name` 속성을 알 수 있다.

- type: 기본적으로 text값을 가집니다. type만으로도 다양한 기능을 충분히 만들 수 있습니다. [참고](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

- name을 지정하면 form을 전송할 때, 사용자가 입력한 값을 name/value쌍으로 전달해줍니다.