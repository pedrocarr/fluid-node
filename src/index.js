import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { SharedMap } from "fluid-framework";
import readlineAsync from "readline-async";


// TODO 1: Configure the container

const client = new TinyliciousClient();
  const containerSchema = {
      initialObjects: { sharedRandomNumber: SharedMap }
  };

async function readInput() {
    // TODO 2: Read the input container id
    let containerId = "";
    console.log("Type a Container ID or press Enter to continue: ");
    await readlineAsync().then( line => {
    console.log("You entered: " + line);
    containerId = line;
    
    });
    return containerId;
  }
  
  function loadCli(map) {
     // TODO 3: Set the value that will appear on the terminal
     const newRandomNumber = () => {
        map.set("random-Number-Key", Math.floor(Math.random() * 100) + 1);
      };
      setInterval(newRandomNumber, 1000);
  
     // TODO 4: Register handlers
     const updateConsole = () => {
        console.log("Value: ", map.get("random-Number-Key"));
      }
      updateConsole();
      map.on("valueChanged", updateConsole);
  }
  
  async function createContainer() {
    // TODO 5: Create the container
    const { container } = await client.createContainer(containerSchema);
    container.initialObjects.map.set("random-Number-Key", 1);
    const id = await container.attach();
        console.log("Initializing Node Client----------", id);
    loadCli(container.initialObjects.map);
    return id;
  }
  
  async function loadContainer(id) {
    // TODO 6: Get the container from the Fluid service
    const { container } = await client.getContainer(id, containerSchema);
    console.log("Loading Existing Node Client----------", id);
    loadCli(container.initialObjects.map);
  }
  
  async function start() {
      // TODO 7: Read container id from terminal and create/load container
      const containerId = await readInput();

    if(containerId.length === 0 || containerId === 'undefined' || containerId === 'null') {
    await createContainer();
    } else {
    await loadContainer(containerId);
    }
  }
  
  start().catch(console.error());