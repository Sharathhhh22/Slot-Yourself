const fs = require('fs');
let file = 'fix_appointments_schema.sql';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "USING (auth.uid() = patient_id AND status = 'held');",
  "USING (auth.uid() = patient_id AND status = 'held')\nWITH CHECK (auth.uid() = patient_id);"
);

fs.writeFileSync(file, c);
