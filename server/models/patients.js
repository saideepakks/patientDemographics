'use strict';
let app = require("../../server/server");
module.exports = function (Patients) {

    Patients.getPatientDemographics = async () => {
        try {
            let Patient_Demographics = app.models.Patient_Demographics;
            let demographics = await Patient_Demographics.find();
            let details = await Patients.find();
            let patientDetails = details.map(patient => {
                let demography = demographics.find(demographic => demographic.id == patient.id);
                return {
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
                    createDate: patient.CreateDate.toISOString().slice(0, 10),
                    demography: demography ? {
                        dob: (demography.Dob) ? demography.Dob.toISOString().slice(0, 10) : null,
                        age: demography.Age,
                        gender: demography.Gender,
                        bloodgroup: demography.BloodGroup,
                        maritalstatus: demography.MaritalStatus,
                        created: {
                            by: demography.CreateBy,
                            date: demography.CreateDate.toISOString().slice(0, 10)
                        },
                        modify: {
                            by: demography.ModifyBy,
                            date: (demography.ModifyDate) ? demography.ModifyDate.toISOString().slice(0, 10) : null
                        }

                    } : {}

                }
            }
            );
            if (patientDetails.length == 0)
                throw new Error('patients does not exists');
            return patientDetails;
        } catch (err) {
            console.log("err==>", err);
            return {
                error: true,
                messege: err.message
            }
        }
    };
};
