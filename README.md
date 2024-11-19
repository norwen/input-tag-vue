#Input with Tags Support | Demo
A Vue.js mini demo showcasing a text input component with #tag support.

Features
Tag Suggestions:
As you type #, a dropdown suggests tags from a predefined list.
Tag Styling:
Tags are displayed with distinct styles and colors for better visibility.
Custom Tags:
Users can create and format new tags not present in the suggestion list.
Implementation
Built with Vue.js, this project employs a component-based architecture to ensure scalability and maintainability. The development was conducted under time constraints, prioritizing core functionalities to deliver a functional and efficient demonstration of the #tag feature. The demo currently handles the simplest case where characters are entered sequentially, and many other scenarios are not yet addressed.

Future Improvements
The next steps include enhancing the cursor position calculation algorithm to handle all possible cases and adding keyboard navigation (using the up and down arrow keys) for interacting with the dropdown. These improvements will significantly enhance usability and provide a more robust user experience.

Disclaimer
Implementing tag-supported inputs involves handling cursor positions and content replacement, which can be complex. For production use, consider leveraging specialized libraries like TipTap for enhanced functionality and reliability.
