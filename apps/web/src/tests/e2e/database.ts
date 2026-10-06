import { Pool } from 'pg';

interface Props {
  connectionString: string;
  databaseName: string;
}

export class E2EDatabase {
  private readonly pool: Pool;

  constructor(private readonly props: Props) {
    this.validateConnectionString();

    this.pool = new Pool({
      connectionString: this.props.connectionString,
    });
  }

  static create(props: Props) {
    const e2eDatabase = new E2EDatabase(props);

    return e2eDatabase;
  }

  private validateConnectionString() {
    const url = new URL(this.props.connectionString);
    const databaseName = url.pathname.slice(1);

    if (databaseName !== this.props.databaseName) {
      throw new Error(
        `Refusing to use database "${databaseName}" for E2E cleanup`,
      );
    }
  }

  async validate() {
    const result = await this.pool.query<{
      database_name: string;
    }>(`
      SELECT current_database() AS database_name
    `);

    const databaseName = result.rows[0]?.database_name;

    if (databaseName !== this.props.databaseName) {
      throw new Error(`Connected to unexpected database "${databaseName}"`);
    }
  }

  async clean() {
    await this.validate();

    await this.pool.query(`
      TRUNCATE TABLE
        "users"
      RESTART IDENTITY
      CASCADE
    `);
  }

  async close() {
    await this.pool.end();
  }
}
