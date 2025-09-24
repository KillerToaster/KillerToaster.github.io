//Collapse || Uncollapse toggles
const btn = document.querySelector(".collapse-btn");
const section = document.getElementById("collapsible");

btn.addEventListener("click", () => {
  section.classList.toggle("expanded");
});


//Uncheck all boxes
document.getElementById("uncheckAllBtn").addEventListener("click", () => {
    document.querySelectorAll(".checkbox-grid input[type='checkbox'], .checkbox-grid input[type='radio']").forEach(cb => {
      cb.checked = false;
    });
  });


  //Generate name code
  let namesData = null;

  // Load the JSON once at page load
  fetch("names.json")
    .then(response => response.json())
    .then(data => {
      namesData = data;
    })
    .catch(err => console.error("Error loading JSON:", err));
  
  //pick a random element from an array
  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  

  //check for common substrings
  function hasCommonSubstring(str1, str2) {
    
    if((str1.toLowerCase()).includes(str2) || (str2.toLowerCase()).includes(str1) || str1.toLowerCase() == str2.toLowerCase())
        return true;
    return false;
}
  
function getPrefix(){
    //get tags from the checkboxes
    const allChecked = document.querySelectorAll('input[type="checkbox"]:checked');
    //put tags in an array
    const allValues = Array.from(allChecked).map(cb => cb.value);
    let prefix = "";

    //get all prefixes
    let validPrefixes = namesData.prefixes;

    //check if any tags
    if(allValues.length == 0){ //if zero tags
        //get a totally random value
        prefix = randomItem(validPrefixes).prefix;
    }
    else{       //get random prefix based on the tags
        //get random quality from the array
        const randomQuality = randomItem(allValues);
        console.log(randomQuality);
        const matches = validPrefixes.filter(item => item.tags.includes(randomQuality));
        prefix = randomItem(matches).prefix;
    }
    return prefix;
}

function getSuffix(warrior){
    let suffix = "";

    //get tags from the checkboxes
    const allChecked = document.querySelectorAll('input[type="checkbox"]:checked');
    //put tags in an array
    const allValues = Array.from(allChecked).map(cb => cb.value);

    //get all suffixes
    let validSuffixes = namesData.suffixes;
    if(warrior)
    {
        //filter out ranks
        const ranks = ["kit", "paw", "star"];
        const filteredSuffixes = validSuffixes.filter(item => item.tags.every(tag => !ranks.includes(tag)));
    }

    //get random suffix based on tags

    //check if any tags
    if(allValues.length == 0){ //if zero tags
        //get a totally random value
        suffix = randomItem(validSuffixes).suffix;
        console.log(suffix + " no tags");
    }
    else{       //get random prefix based on the tags
        //get random quality from the array
        const randomQuality = randomItem(allValues);
        console.log(randomQuality);
        const matches = validSuffixes.filter(item => item.tags.includes(randomQuality));
        suffix = randomItem(matches).suffix;
        console.log(suffix + " tag");
    }

    return suffix;
}

//on "Generate Name" button click
document.getElementById("generateBtn").addEventListener("click", () => {
    if (!namesData) {
      alert("Names are still loading, please wait a second.");
      return; //error handling
    }

    const selectedRank = document.querySelector('input[name="rank"]:checked');
    let prefix = "";
    let suffix = "";

    let validName = false;

    while(!validName)
    {
        if (selectedRank){
            if (selectedRank.value == "kit") {
                console.log("Chosen rank:", selectedRank.value);
                suffix = "kit";
                prefix = getPrefix();
            } 
            else if (selectedRank.value == "apprentice"){
                console.log("Chosen rank:", selectedRank.value);
                suffix = "paw";
                prefix = getPrefix();
            }
            else if (selectedRank.value == "leader"){
                console.log("Chosen rank:", selectedRank.value);
                suffix = "star";
                prefix = getPrefix();
            }
            else {
                console.log("Warrior");
                prefix = getPrefix();
                suffix = getSuffix(true);
            }
        }
        else{
            console.log("No rank selected")
            prefix = getPrefix();
            suffix = getSuffix(false);
        }

        if(!hasCommonSubstring(prefix,suffix))
        {
            validName = true;
        }
    }

    const fullName = prefix + suffix;

    //change label
    document.getElementById("result").textContent = fullName;
  });