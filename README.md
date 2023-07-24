# Atellier Question and Answers API

This API is used to interact with the question and answers section of the product page. It allows the user to view, ask, answer, report, and upvote questions on products that are sold by Atellier.

## Endpoints

### Questions

**GET** `/qa/questions/:product_id`

Returns a list of questions related to a product id

Option query parameters

* Count: number of questions related to product
* Page: Pagination feature to skip questions

**POST** `/qa/questions/`

Post a question for a specific product

Required Request Body
```
{
    "product_id": <Number>,
    "body":       <String>,
    "name":       <String>,
    "email":      <String>
}
```
**PUT** `qa/questions/:question_id/helpful`

Allows a user to vote a question as helpful, incrementing its helpful score.

**PUT** `qa/questions/:question_id/report`

Allows a user to vote a question as helpful, incrementing its helpful score.

# Answers
**GET** `qa/questions:/:question_id/answers`

Returns a list of answers related to a question id

Option query parameters

* Count: number of answers related to product
* Page: Pagination feature to skip answers

**POST** `/qa/questions/:question_id/answers`

Post an answer to a specific questions

Required Request Body
```
{
    "question_id": <Number>,
    "body":        <String>,
    "name":        <String>,
    "email":       <String>
}
```
**PUT** `qa/questions/answers/:answer_id/helpful`

Allows a user to vote a answer as helpful, incrementing its helpful score.

**PUT** `qa/questions/answers/:answer_id/report`

Allows a user to vote a answer as helpful, incrementing its helpful score.
