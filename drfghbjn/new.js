// 1. The Dataset
let availableKeywords = [
    'HTML',
    'CSS',
    'Easy Tutorials',
    'Web Design Tutorials',
    'JavaScript',
    'Where to learn coding',
    'Where to learn Web Design',
    'How to create a website',
    'Python',
    'Java',
    'C++',
    'React JS',
    'Node JS',
    'Sri Lanka',
    'Colombo',
    'Search Box Design'
];

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

// 2. Listen for typing
inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;

    if(input.length){
        // Filter the data based on input
        result = availableKeywords.filter((keyword)=>{
            // Compare lowercase input with lowercase data
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
    }

    // Call the function to show results
    display(result);

    // If input is empty, clear the list
    if(!result.length){
        resultsBox.innerHTML = '';
    }
}

// 3. Display the lines
function display(result){
    // Map the data to HTML <li> tags
    const content = result.map((list)=>{
        // "onclick" makes it clickable
        return "<li onclick=selectInput(this)>" + list + "</li>";
    });

    // Put the <li> tags inside a <ul> and into the box
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

// 4. What happens when you click a line
function selectInput(list){
    // Put the clicked text into the input box
    inputBox.value = list.innerHTML;
    // Clear the suggestion list
    resultsBox.innerHTML = '';
}