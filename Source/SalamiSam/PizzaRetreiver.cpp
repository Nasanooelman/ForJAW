// Fill out your copyright notice in the Description page of Project Settings.


#include "PizzaRetreiver.h"

// Sets default values for this component's properties
UPizzaRetreiver::UPizzaRetreiver()
{
	// Set this component to be initialized when the game starts, and to be ticked every frame.  You can turn these features
	// off to improve performance if you don't need them
	// ...
}


// Called when the game starts
void UPizzaRetreiver::BeginPlay()
{
	Super::BeginPlay();

	// ...
	
}

void UPizzaRetreiver::OnView()
{
	APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();
	ABasicPlayer* PlayerClass = Cast<ABasicPlayer>(Player);

	if (PlayerClass)
	{
		PlayerClass->SetFocused("PIZZA BOXER");
	}
}


// Boxes and scores the Pizza
void UPizzaRetreiver::OnInteract()
{
	APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();
	ABasicPlayer* PlayerClass = Cast<ABasicPlayer>(Player);

	// If they havent already got a pizza.
	if (PlayerClass->GetHeldPizza() != nullptr)
	{
		CPizza* CurrentPizza = PlayerClass->GetHeldPizza();

		int ScoreToAdd = 0;
		if (CurrentPizza->GetCooked() == "Uncooked")
		{
			ScoreToAdd = -5;
		}
		else if (CurrentPizza->GetCooked() == "Cooked")
		{
			ScoreToAdd = 5;
		}
		else if (CurrentPizza->GetCooked() == "Crispy")
		{
			ScoreToAdd = 2;
		}
		else
		{
			ScoreToAdd = -10;
		}

		PlayerClass->Score += ScoreToAdd;

		// It's gone get rid of it
		PlayerClass->DropPizza();

		UE_LOG(LogClass, Log, TEXT("PIZZA BOXED AND SENT OFF! NEW SCORE %d"), PlayerClass->Score);
	}
	else
	{
		UE_LOG(LogClass, Log, TEXT("NO CURRENT PIZZA"));
	}
}


