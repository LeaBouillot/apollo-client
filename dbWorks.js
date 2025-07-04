const database = require("./database.js");

// chercher des données qui correspondent à certains critères(args), puis de récupérer seulement une partie de ces données selon la page souhaitée.
const dataFiltered = (which, args) => {
  let result = database[which].filter((item) => {
    // args n’existe pas, la condition renvoie true (accepte tous les éléments)
    return (
      !args ||
      Object.keys(args).reduce((a, b) => {
        return a && (["page", "per_page"].includes(b) || item[b] == args[b]);
      }, true)
    );
  });
  // .reduce((a, b) => { ... }, true)
  // a+b: (accumulator + currentValue)
  // true: initialValue

  // pagenation
  if (args.page && args.per_page) {
    result = result.slice(
      (args.page - 1) * args.per_page,
      args.page * args.per_page
    );
  }
// arr.slice(début(inclus), fin(exclus));
  return result;
};

const dbWorks = {
  deleteItem: (which, args) => {
    const deleted = database[which].filter((item) => {
      return item.id == args.id;
    })[0];
    database[which] = database[which].filter((item) => {
      return item.id != args.id;
    });
    return deleted;
  },

  getTeams: (args) =>
    dataFiltered("teams", args).map((team) => {
      team.members = dbWorks.getPeople({ team: team.id });
      return team;
    }),
  postTeam: (args) => {
    const newTeam = {
      id:
        database.teams
          .map((team) => {
            return Number(team.id);
          })
          .reduce((a, b) => {
            return Math.max(a, b);
          }, 0) + 1,
      ...args.input,
    };
    database.teams.push(newTeam);
    return newTeam;
  },
  editTeam: (args) => {
    return database.teams
      .filter((team) => {
        return team.id == args.id;
      })
      .map((team) => {
        Object.assign(team, args.input);
        return team;
      })[0];
  },

  getPeople: (args) =>
    dataFiltered("people", args).map((person) => {
      person.tools = [
        ...dbWorks.getEquipments({ used_by: person.role }),
        ...dbWorks.getSoftwares({ used_by: person.role }),
      ];
      person.givens = [
        ...dbWorks.getEquipments({ used_by: person.role }),
        ...dbWorks.getSupplies({ team: person.team }),
      ];
      return person;
    }),
  postPerson: (args) => {
    const newPerson = {
      id:
        database.people
          .map((person) => {
            return Number(person.id);
          })
          .reduce((a, b) => {
            return Math.max(a, b);
          }, 0) + 1,
      ...args.input,
    };
    database.people.push(newPerson);
    return newPerson;
  },
  editPerson: (args) => {
    return database.people
      .filter((person) => {
        return person.id == args.id;
      })
      .map((person) => {
        Object.assign(person, args.input);
        return person;
      })[0];
  },

  getRoles: (args) =>
    dataFiltered("roles", args).map((role) => {
      role.members = dbWorks.getPeople({ role: role.id });
      role.equipments = dbWorks.getEquipments({ used_by: role.id });
      role.softwares = dbWorks.getSoftwares({ used_by: role.id });
      return role;
    }),

  getEquipments: (args) => dataFiltered("equipments", args),
  postEquipment: (args) => {
    database.equipments.push(args);
    return args;
  },
  increaseEquipment: (args) => {
    return database.equipments
      .filter((equipment) => {
        return equipment.id == args.id;
      })
      .map((equipment) => {
        equipment.count += 1;
        return equipment;
      })[0];
  },

  getSoftwares: (args) => dataFiltered("softwares", args),

  getSupplies: (args) => dataFiltered("supplies", args),
};

module.exports = dbWorks;
