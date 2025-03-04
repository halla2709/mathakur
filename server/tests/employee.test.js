const databaseHelper = require("../services/databaseHelper.js");
const app = require("../app.js");
const request = require("supertest");
jest.mock("../services/databaseHelper.js");


describe("employee", () => {
    const employeeJohn = { 
        name: "John", nickname: "Johnny", credit: 432,
        photoUrl: "fjkdlsfjskdla", companyid: "jfdsafi", active: true, id: "111"
    };
    const employeeMary = { 
        name: "Mary", nickname: "Mary", credit: 234,
        photoUrl: "fjkdlsfjskdla", companyid: "jfdsafi", active: true,  id: "222"
    };

    test("can get all employees from database", async () => {
        databaseHelper.getFromTable.mockResolvedValue([employeeJohn, employeeMary]);
        const response = await request(app).get("/employee");
        expect(response.statusCode).toBe(200);
        expect(response._body.length).toBe(2);
        expect(response._body[0].name).toBe("John");
        expect(response._body[1].name).toBe("Mary");
    });

    test("return error if old credit does not match new credit when updating", async () => {
        
    });

    test("update credit if credit change is valid", async () => {
        const employeeId = employeeJohn.id;
        const receipt = [
            { quantity: 1, price: 100 },
            { quantity: 8, price: 50  }
        ]
        databaseHelper.getFromTable.mockResolvedValue([employeeJohn]);
        databaseHelper.addShoppingHistoryForEmployee.mockResolvedValue({});
        databaseHelper.updateEmployeeCredit.mockResolvedValue({});

        const response = await request(app).patch("/employee/transaction/"+employeeId)
                                .send({receipt: receipt})
                                .set("Accept", 'application/json');
        expect(response.statusCode).toBe(200);          
        expect(databaseHelper.updateEmployeeCredit).toHaveBeenCalledTimes(1);
        expect(databaseHelper.updateEmployeeCredit.mock.calls[0][0]).toBe(employeeId);
        expect(databaseHelper.updateEmployeeCredit.mock.calls[0][1]).toBe(500);
    });

});
