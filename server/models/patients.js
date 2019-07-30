'use strict';
let app = require("../../server/server");
module.exports = function (Patients) {


    Patients.getPatientDemographics = async () => {
        try {
            let Patient_Demographics = app.models.Patient_Demographics;
            let demographics = await Patient_Demographics.find();
            let details = await Patients.find();

            let patientDetails = details.map(patient =>
                ({
                    id: patient.PatientId,
                    email: patient.Email,
                    name: {
                        first: patient.FirstName,
                        last: patient.LastName
                    },
                    modify: {
                        by: patient.ModifyBy,
                        date: patient.ModifyDate
                    },
                    createDate: patient.CreateDate
                })
            );

            let patientDemographics = demographics.map(patient => ({
                id: patient.PatientId,
                dob: patient.Dob,
                age: patient.Age,
                gender: patient.Gender,
                maritalstatus: patient.MaritalStatus,
                bloodgroup: patient.BloodGroup,
                create: {
                    by: patient.CreateBy,
                    date: patient.CreateDate
                },
                modify: {
                    by: patient.ModifyBy,
                    date: patient.ModifyDate
                }
            }))

            let getDemographics = (patientDetails) => {
                patientDetails.map(
                    patient => {
                        patient.demographics = patientDemographics.filter(demographic => demographic.id == patient.id)
                    }
                )
            }
            getDemographics(patientDetails);
            return patientDetails;
        } catch (err) {
            return {
                error: true,
                messege: err.messege
            }
        }
    };
};
