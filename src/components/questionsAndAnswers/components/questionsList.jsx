import React, { useState, useEffect } from 'react';
import QuestionItem from './QuestionItem.jsx';

const QuestionsList = ({showMore, shownQ, product, questions, setQuestions}) => {



  if (questions === 'init') {
    // make this the same size as the other part so that it doesn't look so janky
    return (
      <div>
        <p>loading questions...</p>
      </div>
    );
  } else {
    // conditional rendering
    const [renderedQuestions, setRenderedQuestions] = useState(questions.sort(sortByHelpful).slice(0, shownQ));


    const sortByHelpful = (a, b) => {
      return a.question_helpfulness - b.question_helpfulness;
    }

    const moreQuestions = () => {
      showMore(shownQ + 2);
      setRenderedQuestions(questions.sort(sortByHelpful).slice(0, shownQ));
      setQuestions('init');
    }


    return (
      <div>
        {renderedQuestions.map(q=><QuestionItem question={q} product={product} setQuestions={setQuestions}/>)}
        {questions.length > shownQ && <p className='qna-button' onClick={()=>moreQuestions()}>Show More Questions</p>}
      </div>
    )
  }



}

export default QuestionsList;