-- 1. Add ticket_number to appointments_v2 (auto-increments)
ALTER TABLE appointments_v2 ADD COLUMN IF NOT EXISTS ticket_number SERIAL;

-- 2. Update get_receipt RPC to include ticket_number
CREATE OR REPLACE FUNCTION get_receipt(receipt_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', a.id,
        'ticket_number', a.ticket_number,
        'appointment_date', a.appointment_date,
        'appointment_time', a.appointment_time,
        'reason', a.reason,
        'status', a.status,
        'clinic_name', c.name,
        'department_name', d.name,
        'doctor_name', doc.name,
        'patient_name', p.full_name,
        'patient_email', p.email,
        'patient_mobile', p.mobile,
        'patient_address', p.address
    )
    INTO result
    FROM appointments_v2 a
    LEFT JOIN clinics c ON a.clinic_id = c.id
    LEFT JOIN departments d ON a.department_id = d.id
    LEFT JOIN doctors doc ON a.doctor_id = doc.id
    LEFT JOIN profiles p ON a.patient_id = p.id
    WHERE a.id = receipt_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
