# Seal Project 2

**Name:** Hojoon Kim

**App Name:** Urban Passport Log

**Description:** Lets users search and save cities they've been to and those they'd like to go in the future. It uses the Teleport API to populate city details and images.

**GitHub URL:** https://github.com/hojoon0724/seal_project2

**Deployed Website:** https://hk-seal-project2.onrender.com

**Trello Board:** TBD

## List of Dependencies (package.json)

#### Node Dependencies

- express
- bcrypt
- mongo
- ejs
- express-session
- method-override
- mongoose
- morgan

#### Front-end Dependencies

- jQuery
- Alpine

## Route Map

Table listing all routes

| Route Name   | Endpoint         | Method | Description                                                                       |
| ------------ | ---------------- | ------ | --------------------------------------------------------------------------------- |
| Login Form   | /user/login      | GET    | User login page                                                                   |
| Login        | /user/login      | POST   | User login action                                                                 |
| Sign-up Form | /user/signup     | GET    | User signup page                                                                  |
| Sign-up      | /user/signup     | POST   | User signup action                                                                |
| Logout       | /user/logout     | GET    | User signup action                                                                |
|              |                  |        |                                                                                   |
| Search       | /index/search    | GET    | Lets user search for existing cities in the Teleport API                          |
| Index        | /index           | GET    | Lists all cities in the user's collection                                         |
| New          | /index/new       | POST   | User adds a selection to their collection                                         |
| Delete       | /index/id/delete | DELETE | Tells the server to delete an entry                                               |
| Update       | /index/id/update | PUT    | Sending the updates to the DB                                                     |
| Create       | /index/create    | POST   | User creates an entry to their collection                                         |
| Edit         | /index/id/edit   | GET    | Editing UI page                                                                   |
| Show         | /index/id/show   | GET    | Site shows the city's details such as when the user visited, the population, etc. |

## Design Mockups (Desktop + Mobile)

#### Desktop Design

![Desktop UI preview](./ui-sample/Desktop.png)

#### Mobile Design

![Mobile UI preview](./ui-sample/Mobile.png)

## ERD (Entity Relationship Diagram)

| USER     |     | CITY        |
| -------- | --- | ----------- |
| \_id     |     | \_id        |
|          |     | city        |
|          |     | country     |
|          |     | population  |
|          |     | coordinates |
|          |     | desktop_img |
|          |     | mobile_img  |
|          |     | status      |
|          |     | date        |
| user     | --> | creator     |
| password |     |             |

---

## Teleport API Reference

#### Text Search Response

- Full Name
  `_embedded["city:search-results"].matching_full_name`

- Link to the city's details page
  `_embedded["city:search-results"]._links["city:item"].href`

- Cities have their unique page
  `https://api.teleport.org/api/cities/geonameid:#######/`

- `geonameid:#######` is the unique identifier on Teleport

#### geonameid Response

https://api.teleport.org/api/cities/geonameid:#######/

- If this exists, then there will be pictures and other data
  `_links["city:urban_area"].href`

- Short name
  `name`

- Population
  `population`

- Location
  `location.latlon.geohash`
  `location.latlon.latitude`
  `location.latlon.longitude`

#### urban_area response

https://api.teleport.org/api/urban_areas/slug:dallas/

- Photos
  `_links["ua:images"].href`

#### images response

https://api.teleport.org/api/urban_areas/slug:dallas/images/

`photos.image.mobile`
`photos.image.web`

## Object Structure

| data        | source     | required | type    |
| ----------- | ---------- | -------- | ------- |
| \_id        | auto       | yes      | string  |
| geonameid   | geonameid  | no       | string  |
| city        | geonameid  | yes      | string  |
| country     | geonameid  | yes      | string  |
| urban_area  | geonameid  | yes      | boolean |
| population  | geonameid  | no       | number  |
| coordinates | geonameid  | no       | string  |
| desktop_img | urban_area | no       | string  |
| mobile_img  | urban_area | no       | string  |
| status      | user       | yes      | string  |
| date        | user       | no       | string  |
| creator     | auto       | yes      | string  |
