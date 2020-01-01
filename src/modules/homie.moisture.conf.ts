export const homie = {
  $homie: "v4.0.0",
  $name: "snake plant",
  $nodes: [
    {
      $name: "soil",
      $type: "resistance",
      $properties: "moisture",
      moisture: {
        $name: "moisture",
        $datatype: "integer",
        $settable: "false",
        $retained: "true"
      }
    }
  ]
};
