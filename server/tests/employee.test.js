const databaseHelper = require("../services/databaseHelper.js");
const cloudinaryHelper = require("../services/cloudinaryHelper.js");
const app = require("../app.js");
const request = require("supertest");
jest.mock("../services/databaseHelper.js");
jest.mock("../services/cloudinaryHelper.js");

describe("employee", () => {
    const employeeJohn = { 
        name: "John", nickname: "Johnny", credit: 432,
        photoUrl: "fjkdlsfjskdla", companyid: "jfdsafi", active: true, id: "111"
    };
    const employeeMary = { 
        name: "Mary", nickname: "Mary", credit: 234,
        photoUrl: "fjkdlsfjskdla", companyid: "jfdsafi", active: true,  id: "222"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        databaseHelper.addShoppingHistoryForEmployee.mockResolvedValue({});
        databaseHelper.addAdminHistoryForEmployee.mockResolvedValue({});
        databaseHelper.updateEmployeeCredit.mockResolvedValue({});
        databaseHelper.updateEmployee.mockResolvedValue({});
        cloudinaryHelper.savePhotoToCloudinary.mockImplementation(function(req,res,next) { next(); });
    });

    test("can get all employees from database", async () => {
        databaseHelper.getFromTable.mockResolvedValue([employeeJohn, employeeMary]);
        const response = await request(app).get("/employee");
        expect(response.statusCode).toBe(200);
        expect(response._body.length).toBe(2);
        expect(response._body[0].name).toBe("John");
        expect(response._body[1].name).toBe("Mary");
    });

    test("return error if old credit does not match new credit when updating", async () => {
        databaseHelper.getFromTable.mockResolvedValue([employeeJohn]);
        const invalidOldCredit = employeeJohn.credit-100;
        const newCredit = employeeJohn.credit+100;
        const response = await request(app).patch("/employee/"+employeeJohn.id)
                                            .send({ newCredit: newCredit, oldCredit: invalidOldCredit })
                                            .set("Accept", 'application/json');
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe("Employee credit changed before updating");
        expect(databaseHelper.updateEmployee).toHaveBeenCalledTimes(0);
    });

    test("update credit if credit change is valid", async () => {
        const employeeId = employeeJohn.id;
        const newCredit = employeeJohn.credit+100;
        databaseHelper.getFromTable.mockResolvedValue([employeeJohn]);

        const response = await request(app).patch("/employee/"+employeeId)
                                .send({ newCredit: newCredit, oldCredit: employeeJohn.credit })
                                .set("Accept", 'application/json');
        expect(response.statusCode).toBe(200);          
        expect(databaseHelper.updateEmployee).toHaveBeenCalledTimes(1);
        expect(databaseHelper.updateEmployee.mock.calls[0][0]).toBe(employeeId);
        expect(databaseHelper.updateEmployee.mock.calls[0][1]).toBe(newCredit);
    });

});
