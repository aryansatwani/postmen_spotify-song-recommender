// client-side js, loaded by index.html. Run when web page is loaded

// any console.log in this file will appear the browser console
console.log("Hello from script.js!");

const handlebars = window.Handlebars;
const {axios} = window

const output = document.getElementById("recommendation-output");
const button = document.getElementById("submitButton");

const submitForm = async (event) => {
  try {
    event.preventDefault();
    disableButton();

    console.log(event);

    //get form values
    const { elements } = event.target;
    const artist1 = elements.artist1.value;
    const artist2 = elements.artist2.value;
    const artist3 = elements.artist3.value;

    let result;
    try {
      result = await axios.post("/recommendations", { artist1,artist2,artist3 });
      console.log(result)
    } catch (err) {
      let errMsg = "Something went wrong";
      if (err.response.data.message) {
        errMsg = err.response.data.message;
      }
      return alert(errMsg);
    }

    const recommendations = result.data.tracks;
    const topFiveRecs = recommendations.slice(0, 5);
    console.log(topFiveRecs)

    const template = handlebars.compile(templateRaw);
    const recommendationsHtml = template({ topFiveRecs });

    output.innerHTML = recommendationsHtml;
  } catch (err) {
    alert("Something went wrong" + err.message);
  } finally {
    enableButton();
  }
};

const disableButton = () => {
  button.value = "Searching...";
  button.disabled = true;
};

const enableButton = () => {
  button.value = "Get Recommendations";
  button.disabled = false;
};

const templateRaw = `
<p> If you like these artists ,you'll love:<p>
<ul>
{{#each topFiveRecs}}
<li>{{name}} - <a href = "{{external_urls.spotify}}" target = "_blank">Play</a</li>
{{/each}}
</ul>
`;
