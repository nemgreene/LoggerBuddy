import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import TagSelect from "../../../../TagSelect";
import { FormSkeleton, colors } from "../../../../Utility";
import ItemLabelSelect from "./ItemLabelSelect";

export default function ItemFormLabels({ form, changeForm, possibleLabels }) {
  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            justifyContent: "center",
            m: (t) => t.spacing(1),
            textAlign: "center",
          }}
        >
          Labels
        </Typography>
        {form?.labels?.length < 1 && <FormSkeleton />}
        <ItemLabelSelect
          value={form.labels}
          changeForm={changeForm}
          options={possibleLabels}
          label={"Add Labels"}
        />
      </CardContent>
    </Card>
  );
}
