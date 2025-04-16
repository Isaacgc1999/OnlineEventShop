# 🎟️ Event Booking App

## Event Booking App

Is a web application developed with **Angular 19** that allows users to view events and manage seat reservations through a shopping cart. It is fully responsive, modular, and built with a scalable architecture based on reactive programming.

---

## 🧰 Tech Stack

| Technology         | Version / Usage                             |
|--------------------|---------------------------------------------|
| Angular            | 19                                          |
| Angular Router     | Navigation between event list and event detail |
| RxJS               | Reactive communication between services and components |
| SASS (SCSS)        | Styles with BEM methodology                 |
| Material Design    | Visual components                           |
| Angular Signals    | `@input()` / `@output()` reactive signals   |
| TypeScript         | Strict typing                               |

---
## ⚽ Playground (run without installing or downloading anything)
https://stackblitz.com/~/github.com/Isaacgc1999/OnlineEventShop

## 📷 Screenshots
![image](https://github.com/user-attachments/assets/0a449bca-310a-4a91-8f77-99258f9a0ed5)
![image](https://github.com/user-attachments/assets/753f2185-0cb7-4815-9569-9180e3e72082)


## 🧱 Project Architecture
```
OnlineEventShop/
├── .angular/
├── .vscode/
├── coverage/
├── node_modules/
├── public/
│   └── ... # Static assets (fonts, etc. - based on your file explorer)
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── cart.model.ts
│   │   │   │   ├── event-info.model.ts
│   │   │   │   └── event.model.ts
│   │   │   ├── services/
│   │   │   │   ├── cart/
│   │   │   │   │   ├── cart.service.spec.ts
│   │   │   │   │   └── cart.service.ts
│   │   │   │   └── catalogue/
│   │   │   │       ├── catalogue.service.spec.ts
│   │   │   │       └── catalogue.service.ts
│   │   │   └── ... # Other core files
│   │   ├── features/
│   │   │   ├── catalogue/
│   │   │   │   ├── catalogue.component.html
│   │   │   │   ├── catalogue.component.scss
│   │   │   │   ├── catalogue.component.spec.ts
│   │   │   │   └── catalogue.component.ts
│   │   │   └── event-info/
│   │   │       ├── card-info/
│   │   │       │   ├── card-info.component.html
│   │   │       │   ├── card-info.component.scss
│   │   │       │   ├── card-info.component.spec.ts
│   │   │       │   └── card-info.component.ts
│   │   │       ├── event-info.component.html
│   │   │       ├── event-info.component.scss
│   │   │       ├── event-info.component.spec.ts
│   │   │       └── event-info.component.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── button/
│   │   │   │   │   ├── button.component.html
│   │   │   │   │   ├── button.component.scss
│   │   │   │   │   ├── button.component.spec.ts
│   │   │   │   │   └── button.component.ts
│   │   │   │   ├── card/
│   │   │   │   │   ├── card.component.html
│   │   │   │   │   ├── card.component.scss
│   │   │   │   │   ├── card.component.spec.ts
│   │   │   │   │   └── card.component.ts
│   │   │   │   ├── cart/
│   │   │   │   │   ├── cart.component.html
│   │   │   │   │   ├── cart.component.scss
│   │   │   │   │   ├── cart.component.spec.ts
│   │   │   │   │   └── cart.component.ts
│   │   │   │   └── number-input/
│   │   │   │       ├── number-input.component.html
│   │   │   │       ├── number-input.component.scss
│   │   │   │       ├── number-input.component.spec.ts
│   │   │   │       └── number-input.component.ts
│   │   │   ├── header/
│   │   │   │   ├── header.component.html
│   │   │   │   ├── header.component.scss
│   │   │   │   ├── header.component.spec.ts
│   │   │   │   └── header.component.ts
│   │   │   └── colors.scss
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
... #Other configuration files
```

## 🧑‍💻 Features

### 🗂️ Event List (Catalogue)

- Displays a grid of events:
  - 📱 1 column on small screens
  - 💻 2 columns on medium/large screens
- Event card:
  - Title, subtitle, place, dates, description, image, and Buy button
  - Link to event detail view
- Sorted by end date (ascending order)

### 🎫 Event Detail

- List of available sessions:
  - One session per row
  - Date, availability, and seat selection with `+` and `-` buttons
  - Prevent overflow: does not allow selecting more seats than available
  - Prevent underflow: does not allow negative values
- Responsive design:
  - 100% width on mobile
  - 50% width on medium/large screens
- Displays `"EVENT INFO NOT FOUND"` message if no data is available

### 🛒 Shopping Cart

- Reusable across the project
- Grouped by event
- Displays:
  - Event title
  - Sessions with selected seats and delete button (trash icon)
- "Back" button to return to the event list

---

## 🎨 Styles

- **SASS + BEM** for maintaining scalable and modular styles
- Centralized color palette in `colors.scss`:
```scss
// colors.scss
$primary-color: #2a3f54;
$accent-color: #e91e63;
$background-color: #f5f5f5;
$text-color: #333;
$error-color: #ff5252;
```
## 🧪 Testing

- Unit tests with Karma and Jasmine
- Coverage:
  - Services (`CartService`, `CatalogueService`)
  - Components (`CartComponent`, `NumberInputComponent`, `EventInfoComponent`, etc.)
  - `@Input()` / `@Output()` communication with component mocks (`host components`)
 
    ![image](https://github.com/user-attachments/assets/41836d28-1d8d-468d-82a7-ef6002ac1614)

---

## 🚀 How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run in development mode:
     ```bash
   ng serve
   ```
4. Run tests:
   ```bash
   ng test
   ```

## 📱 Responsive Layout

The project uses a responsive design approach to ensure the application is optimized for all screen sizes:

### **Event List (Catalogue)**:
- **Small screens**: Single column layout for event cards.
- **Medium/Large screens**: Two-column grid layout for event cards.
  
The event cards adapt to different screen sizes and adjust their layout accordingly, making use of `flexbox` and CSS media queries for dynamic responsiveness.

### **Event Card Content**:
- **Small screens**: Display event title, subtitle, place, and dates.
- **Medium/Large screens**: In addition to the previous content, show a short description.
- Each card is designed to link to the event detail page, providing a smooth and intuitive user experience.

### **Event Detail View**:
- **Sessions list**: Each session is shown as a single row, optimized for both small and large screens.
  - On **small screens**: The sessions list will span 100% of the screen width.
  - On **medium/large screens**: The sessions list will occupy 50% of the screen width to allow a two-column view.
  
- **Cart Section**: The shopping cart is designed to fit within a responsive grid, ensuring it is user-friendly across devices.

---

### Media Queries Implementation:
The layout automatically adjusts based on the screen size. It uses a combination of:
- **CSS Grid and Flexbox**: For organizing event cards and sessions
- **Media Queries**: To handle changes for small, medium, and large screen sizes



