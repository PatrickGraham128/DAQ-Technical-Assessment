# Brainstorming

In data-emulator and battery-ui, changed start script in package.json to include npx as ts-node was not executing from the project directory

Battery UI colour code:
  - white: more than 10 degrees within safe operating temperature
  - yellow: less than 10 degrees within safe operating temperature
  - red: battery temperature outside safe range