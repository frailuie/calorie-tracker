//buttons to get modals
var openFoodM = document.getElementById("addFoodBtn");
var openExerciseM = document.getElementById("addExerciseBtn");

//buttons
const totalCaloriesBtn = document.getElementById("total-calories");

//arrays to store node lists

//array for selected food
var selectedFoodIcons = [];

//array for selected exercise
var selectedExerciseIcons = [];

//show deficit or surplus in dom
const outputContainer = document.getElementById("display-remaining-calories");

//modals
var foodModal = document.getElementById("foodModal");
var exerciseModal = document.getElementById("exerciseModal");

//close the modals
var closeFoodM = document.getElementsByClassName("closeFood")[0];
var closeExerciseM = document.getElementsByClassName("closeExercise")[0];

//clicking a button to open the modals
openFoodM.onclick = function(){
  foodModal.style.display = "block";
}

openExerciseM.onclick = function(){
  exerciseModal.style.display = "block";
}

//clicking a button to close the modals
closeFoodM.onclick = function(){
  foodModal.style.display = "none";
}

closeExerciseM.onclick = function(){
  exerciseModal.style.display = "none";
}

//get name and calories from food icon
function getValue(event){
  const foodIcons = document.querySelectorAll(".food-icon");

  foodIcons.forEach(function (icon){
    if(icon === event.target) {
      icon.classList.toggle("selected");
    }
    else{
      icon.classList.remove("selected");
    }
    });

  const foodIcon = event.target;

  //update selected  food icons array
  if(selectedFoodIcons.includes(foodIcon)){
    selectedFoodIcons = selectedFoodIcons.filter(icon => icon !== foodIcon);
  } else {
    selectedFoodIcons.push(foodIcon);
  }

  const foodName = foodIcon.getAttribute("alt");
  const foodCalories = Number(foodIcon.getAttribute("data-value"));
  const foodEmoji = foodIcon.getAttribute("data-emoji");

  const entryDropdown = document.getElementById("entry-dropdown")
  const selectedCategory = entryDropdown.value;

  const addCategoryName = document.getElementById("selected-food-" + selectedCategory);

  const foodEntry = document.createElement("div");
  const hrLine = document.createElement("hr");
  const fieldset = document.querySelector("fieldset");

  foodEntry.className = "added-entry";
  fieldset.style.backgroundColor = "#fdfbf0df";
  foodEntry.textContent = foodEmoji + foodName + ": " + foodCalories + " calories";

  foodEntry.appendChild(hrLine);
  addCategoryName.appendChild(foodEntry);

}

//get name and calories from exercise icon
function getExerciseValue(event){
  const exerciseIcons = document.querySelectorAll(".exercise-icon")

  exerciseIcons.forEach(function (icon){
    if(icon === event.target) {
      icon.classList.toggle("selected");
    }
    else{
      icon.classList.remove("selected");
    }
  });

  const exerciseIcon = event.target;

  //update exercise array values 
  if (selectedExerciseIcons.includes(exerciseIcon)){
    selectedExerciseIcons = selectedExerciseIcons.filter(icon => icon !== exerciseIcon);}
    else {
      selectedExerciseIcons.push(exerciseIcon);
    }

  const exerciseName = exerciseIcon.getAttribute("alt");
  const exerciseCalories = Number(exerciseIcon.getAttribute("data-value"));
  const exerciseEmoji = exerciseIcon.getAttribute("data-emoji");

  const addToCategory =  document.getElementById("selected-exercise");

  const exerciseEntry = document.createElement("div");
  const hrLine = document.createElement("hr");
  const fieldset = document.querySelector("fieldset");

  exerciseEntry.className = "added-entry";
  fieldset.style.backgroundColor = "#fdfbf0df";
  exerciseEntry.textContent = exerciseEmoji + exerciseName + ": -" + exerciseCalories + " calories";

  exerciseEntry.appendChild(hrLine);
  addToCategory.appendChild(exerciseEntry);

}

//iterate over each food icon
const foodIcons = document.querySelectorAll(".food-icon");

for(let i = 0; i < foodIcons.length; i++){
  foodIcons[i].addEventListener("click", function(event){
    getValue(event);
  });
}

//iterate over each exercise icon
const exerciseIcons = document.querySelectorAll(".exercise-icon");

for(let n = 0; n < exerciseIcons.length; n++){
  exerciseIcons[n].addEventListener("click", function(event){
    getExerciseValue(event);
  });
}


// calculate total calories
function calculateCalories() {
    let totalCalories = 0;

  //iterate over each food icon with the selected class
  selectedFoodIcons.forEach(function(foodIcon){
    let calories = Number(foodIcon.getAttribute("data-value"))
    totalCalories = totalCalories + calories;
  });

  //iterate over reach exercise icon with the selected class
  selectedExerciseIcons.forEach(function(exercise){
    let calories = Number(exercise.getAttribute("data-value"))
    totalCalories = totalCalories - calories;
  });

  return totalCalories;
}


function calculateSurplusOrDeficit(totalCalories, budgetCalories, weightEntry, IdealWeightEntry){
  let remainingCalories = totalCalories - budgetCalories;
  let surplusOrDeficit = remainingCalories >= 0 ? 'Surplus' : 'Deficit';
 
  let deficit = 
  surplusOrDeficit === 'Deficit' ? Math.abs(remainingCalories) : 0;
  return [remainingCalories, surplusOrDeficit, deficit];
}

  //make the button actually add info to DOM
totalCaloriesBtn.addEventListener("click", function(){
  const totalCalories = calculateCalories(); //get updated calories

  const budgetCalories = document.getElementById("budget").value;
  const weightEntry = document.getElementById("weight").value;
  const idealWeightEntry = document.getElementById("idealWeight").value;

  const [remainingCalories, surplusOrDeficit] = calculateSurplusOrDeficit(
    totalCalories, budgetCalories, weightEntry, idealWeightEntry
  );

  const weeksToLoseWeight = calculateTimeToLose(
    remainingCalories, budgetCalories, weightEntry, idealWeightEntry
  );

  const totalEntry = document.createElement("div");
  totalEntry.className = "added-calories";
  totalEntry.textContent = "Total Calories: " + totalCalories;
  
  const totalContainer = document.getElementById("display-calories");
  totalContainer.innerHTML = ""; //clear previous entries
  totalContainer.appendChild(totalEntry);

  const caloriesOutput = document.createElement("div");
  caloriesOutput.className = "added-calories";
  caloriesOutput.textContent = `${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}`
  
  const outputContainer = document.getElementById("display-remaining-calories");
  outputContainer.innerHTML = ""; //clear previous entries
  outputContainer.appendChild(caloriesOutput);

  const desc = document.getElementById("description");
  desc.style.display = "block";

  //adding code for line graph to run when button is clicked
  const weightLossPerWeek = (weightEntry - idealWeightEntry) / weeksToLoseWeight;

  const dataList = [];

  //iterate over every week needed to add to array
  for(let week = 1; week <= weeksToLoseWeight; week++){
    const weightAtEachWeek = weightEntry - (weightLossPerWeek * week);
    dataList.push({week: `week ${week}`, weight: weightAtEachWeek});
  }

  anychart.onDocumentReady(function() { 
    var dataSet = anychart.data.set(dataList);
  
    //map the data
    var firstSeriesData = dataSet.mapAs({x: "week", value: "weight"}); //weight data
  
    //create a line graph
    var chart = anychart.line();
  
    //name the data
    var firstSeries = chart.line(firstSeriesData);
    firstSeries.name("Weight Change");
    firstSeries.normal().stroke("#fce574", 2);
  
    //add a legend
    chart.legend().enabled(true);
  
    //add a title
    chart.title("Starting Weight to Target Goal Weight");
    chart.yAxis().title("Weight (lbs)")
    chart.xAxis().title("# of Weeks")
  
    //tell the chart where to display
    chart.container("display-line-graph")
  
    //draw the chart
    chart.draw();
  
  });
});


//check if enter key is pressed after entering weights
document.addEventListener("DOMContentLoaded", function(){
  var budgetInput = document.getElementById("budget");
  var weightInput = document.getElementById("weight");
  var idealWeightInput = document.getElementById("idealWeight");

  budgetInput.addEventListener("keydown", handleKeyDown);
  weightInput.addEventListener("keydown", handleKeyDown);
  idealWeightInput.addEventListener("keydown", handleKeyDown);

  function handleKeyDown(e){
    if (e.key === 'Enter'){
      var enteredValue = +e.target.value; //convert to number
      var inputID = e.target.id //get ID of the variable

      if(inputID === "budget"){
        var budgetCalories = enteredValue;
        console.log('Budget Calories value:',budgetCalories)
        //check if budget was entered and get the value
      }

      else if(inputID === "weight"){
        var weightEntry = enteredValue;
        console.log('Weight:', weightEntry)
      }

      else if(inputID === "idealWeight"){
        var idealWeightEntry = enteredValue;
        console.log('Ideal Weight:', idealWeightEntry)
      }

      e.preventDefault(); //stop form submission
      
    }
  }
})


//for the line graph
function calculateTimeToLose(remainingCalories, budgetCalories, weightEntry, idealWeightEntry){
  let deficit = 0;
  let weeksToLose = 0;
  
  //calculate weekly deficit assuming the user eats the same every day
  if(remainingCalories < 0){
    deficit = 7 * remainingCalories;
  }

  //calculate total deficit needed to reach ideal weight
  const poundsToLose = weightEntry - idealWeightEntry;
  const totalDeficitNeeded = poundsToLose * 3500;
  
  //calculate weeks needed to achieve target weight
  weeksToLose = Math.abs(totalDeficitNeeded / deficit);
  console.log('Weeks to lose:', weeksToLose)

  return weeksToLose;
}


