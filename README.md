----SATHVIC HEALTH----

TECH_STACK:
frontend: React

THINGS TO REMEMBER:
- useNavigate(to route to other pages programatically)
- useLocation(to read data that is sent from other page)
- useContext(to share data globally across components without passing props manually)
- <BrowserRouter>(keeps track of URL, provides routing context to the app, Makes hooks like (useNavigate, useLocation, Link) work)

EXECUTION:
npm run dev

WORK_FLOW:
1. - 26-12-25 - Question, Answers and analysis (data/questions, components/Quiz.jsx)
    - Questions are stored in ./questions file and by importing that into ./Quiz.jsx some funtions are performed
    - showNextQuestion() function to change the questions after clikcing next button
    - vataScore(), pittaScore(), kaphaScore() functions to count the score of those qualities by clicking on the options

2. - 26-12-25 - Buliding the core logic to get the body type
    - The single dosha is decided in utils/getBodyType file and this is nothing without Result page(passed from here to utils).
    - components/Result.jsx file shows the result by importing logic from ./utils/getBodyType
    - Here comes the error like invalid hook and useContext() becomes null because we are using useLocation and useNavigate with out wrapping inside <BrowserRoute>
    !!!!Problem!!!!
    React 19 is the latest version and it doesn't support many libraries like <BrowserRouter> so the UI breaks and also all things doesn't work as expected so I changed version to React 18

    Flow: question(data/questions) -> components/Quiz.jsx -> Result(get scores) -> utils/getBodyType.js (core logic) -> Result(displays the result page).

3. - 05-01-26 - Added images to the questions in data folder and questions file. Upadated it in the quiz page.
   - Should work on styling part of the page.
   
4. - 12-01-26 - Working on the home section
   - Created the Home module in components and installed 2 node moudles (@headlessui/react and @heroicons/react)
   - used this packages to get navbar from the tailwind as it contains icons 
   - @headlessUi provides accessible UI behaviour using styling

5. - 17-01-26 - Previously created the home screen and implemented the button functionality to go to the quiz 
   - Ratherthan creating 3 differnet pages for showing results. Wrote the core functionality in the Result page and 
     added data in the related to 3 body types in the data folder by creating resultData file and giving key as body types
     and their info as value and in that value also they have key and value pairs as title, description (for now and in future expecting to add more key values).
   - Now without using many pages and file we dynamically accessing using props method only in single componenet, so it reduces 
     editing similar code many times and also duplicate code.

6. - 20-01-26 - Updating the result page staticly 
   - created a button in home page which navigates to the result page with out taking the quiz, for now developing the result   
     page for vata body type in future will develop for remaining body types. 