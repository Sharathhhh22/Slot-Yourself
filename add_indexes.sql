-- Create indexes for frequently queried foreign keys
CREATE INDEX IF NOT EXISTS idx_appointments_v2_patient_id ON appointments_v2(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_v2_clinic_id ON appointments_v2(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_v2_doctor_id ON appointments_v2(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_v2_appointment_date ON appointments_v2(appointment_date);

CREATE INDEX IF NOT EXISTS idx_patient_records_patient_id ON patient_records(patient_id);

-- Optional: index for clinics / doctors / departments if searched by ID often, 
-- though primary keys are already indexed automatically.
