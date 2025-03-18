/*
  # Update Initial Statistics

  Updates the statistics table with actual values for:
  - States covered
  - Outreaches conducted
  - Locals reached
  - Communities reached
  - Souls won
  - Rededication commitments
  - Medical beneficiaries
  - Welfare beneficiaries
*/

UPDATE statistics
SET 
  states_covered = 15,
  outreaches_conducted = 13,
  locals_reached = 3500,
  communities_reached = 22,
  souls_won = 1200,
  rededication_commitments = 2500,
  medical_beneficiaries = 3000,
  welfare_beneficiaries = 3200,
  updated_at = now()
WHERE id = (SELECT id FROM statistics LIMIT 1); 