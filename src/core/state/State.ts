import { StateContext, StateType } from "@/type";

export abstract class State {
  type: StateType;
  nextState?: State;
  
  abstract task(context?: StateContext): Promise<void> | void;

  constructor(type: StateType, nextState?: State) {
    this.type = type;
    this.nextState = nextState;
  }

  async execute(context?: StateContext): Promise<void> {
    console.log(`Running state: ${this.type}`);
    
    try {
      await this.task(context);
      console.log(`Successfully completed ${this.type}`);
    } catch (error) {
      console.error(`Failed to complete ${this.type}:`, error);
      throw error;
    }
  }
}

export default State;