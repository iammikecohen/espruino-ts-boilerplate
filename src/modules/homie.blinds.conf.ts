export const homie = {
  $homie: "v4.0.0",
  $name: "blinds",
  $nodes: [
    {
      $name: "motor",
      $type: "stepper",
      $properties: "speed,location,move",
      speed: {
        $name: "speed",
        $datatype: "integer",
        $settable: "true",
        $retained: "true"
      },
      location: {
        $name: "location",
        $datatype: "integer",
        $settable: "true",
        $retained: "true"
      },
      move: {
        $name: "move",
        $datatype: "integer",
        $settable: "true",
        $retained: "false"
      }
    }
  ]
};
