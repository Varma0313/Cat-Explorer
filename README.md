# CatCrudApp

### Technologies

- Angular 21
- Angular Signals
- Angular Material
- TypeScript (strict mode)
- RxJS

## API Note

POST /create and PUT /update may return 502 errors when called
from the browser due to a case-sensitive header check in the
Lambda backend:

event["headers"]["Content-Type"]

Browsers send headers in lowercase ("content-type"), which
causes the validation to fail.

The endpoints work correctly when tested using Postman.

The frontend implementation follows the API specification.
