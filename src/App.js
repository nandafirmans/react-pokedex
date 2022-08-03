import { Button, Card, Col, Layout, message, Row } from "antd";
import { Header } from "antd/lib/layout/layout";
import { useEffect, useState } from "react";
import "./App.css";

const { Content } = Layout;

const useFetchPokemon = () => {
    const [pokemons, setPokemons] = useState([]);
    const [nextPage, setNextPage] = useState(
        "https://pokeapi.co/api/v2/pokemon"
    );
    const [loading, setLoading] = useState(false);

    const fetchPokemons = async (url) => {
        if (!url) return;

        setLoading(true);

        try {
            const response = await fetch(url);
            const { next = "", results = [] } = (await response.json()) || {};

            setPokemons((prevState) => [...prevState, ...results]);
            setNextPage(next);
        } catch (e) {
            console.error(e);
            message.error(e?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemons(nextPage);
    }, []);

    return {
        pokemons,
        loading,
        nextPage: () => fetchPokemons(nextPage),
    };
};

function PokemonCard({ pokemon }) {
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { name, url } = pokemon;

    const fetchPokemon = async (url) => {
        if (!url) return;

        setLoading(true);

        try {
            const response = await fetch(url);
            const { sprites } = (await response.json()) || {};
            const image = sprites?.other?.home?.front_default;

            setPokemonData({ image });
        } catch (e) {
            console.error(e);
            message.error(e?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemon(url);
    }, [url]);

    return (
        <Card
            loading={loading}
            cover={
                pokemonData && (
                    <img
                        alt={name}
                        src={pokemonData.image}
                        style={{
                            width: "auto",
                            height: 190,
                            margin: "auto",
                            padding: 8,
                        }}
                    />
                )
            }
        >
            <Card.Meta title={name} />
        </Card>
    );
}

function App() {
    const { pokemons, loading, nextPage } = useFetchPokemon();

    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
            </Header>
            <Content>
                <div className="site-layout-content">
                    <Row gutter={[16, 16]}>
                        {pokemons.map((pokemon) => (
                            <Col key={pokemon.url} span={8}>
                                <PokemonCard pokemon={pokemon} />
                            </Col>
                        ))}
                    </Row>
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <Button onClick={nextPage} loading={loading}>
                            Next
                        </Button>
                    </div>
                </div>
            </Content>
        </Layout>
    );
}

export default App;
