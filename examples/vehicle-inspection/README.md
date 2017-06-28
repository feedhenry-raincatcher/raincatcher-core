# Vehicle Inspection Example

## Setup

Run `lerna bootstrap --scope=@raincatcher/example-vehicle-inspection --include-scoped-dependencies`

## Sequential use cases

1. Create a new Process
2. Add a `VehicleInspectionTask` to the new Process
    * Configure it via a Form generated from the JsonSchema of the custom `Task`
3. Create a ProcessInstance via a Executor and assign it to a User
4. As the assigned-to User, on the mobile app, start the execution of the `ProcessInstance`
5. Finish the execution of the `VehicleInspectionTask`, moving it to the `TaskStatus.DONE` state
6. Visualize the results of the `VehicleInspectionTask`

## Unordered stories

- As the Process creation form for the portal app, I want to access the list of available Task types and their sets of options (config metadata)
- As the Process creation handler, I want to be able to create the correct type of Task based on the form data
